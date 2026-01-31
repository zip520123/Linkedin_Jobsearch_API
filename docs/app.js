const { createApp, ref, onMounted, watch } = Vue;

createApp({
    setup() {
        const pat = ref(localStorage.getItem('github_pat') || '');
        const loading = ref(false);
        const message = ref('');
        const msgType = ref('info');
        const jobs = ref([]);
        const generatedAt = ref('-');
        const repoUrl = ref('');

        // Default Config
        const defaultConfig = {
            searches: [
                {
                    name: 'iOS Developer London',
                    keyword: 'iOS Developer',
                    location: 'London, United Kingdom',
                    dateSincePosted: '24hr',
                    limit: '25'
                },
                {
                    name: 'Swift Developer Remote',
                    keyword: 'Swift Developer',
                    location: 'Remote',
                    dateSincePosted: 'past week',
                    limit: '25'
                }
            ],
            filters: {
                titleKeywords: ['ios', 'swift'],
                excludeCompanies: [],
                preferredKeywords: ['swiftui', 'combine', 'senior'],
                minSalary: 0
            }
        };

        const configStr = ref(JSON.stringify(defaultConfig, null, 2));

        // Save PAT to local storage
        watch(pat, (newVal) => {
            localStorage.setItem('github_pat', newVal);
        });

        // Load Results from JSON
        const loadResults = async () => {
            try {
                // Add cache buster
                const res = await fetch(`data/latest.json?t=${Date.now()}`);
                if (!res.ok) throw new Error('No data found yet');
                const data = await res.json();
                jobs.value = data.jobs || [];
                generatedAt.value = new Date(data.generatedAt).toLocaleString();
                message.value = 'Data loaded successfully';
                msgType.value = 'success';
                setTimeout(() => message.value = '', 3000);
            } catch (err) {
                console.log(err);
                // Don't show error on initial load if just empty
                if (jobs.value.length > 0) {
                    message.value = 'Failed to refresh data';
                    msgType.value = 'error';
                }
            }
        };

        // Trigger GitHub Action
        const triggerSearch = async () => {
            if (!pat.value) return;
            loading.value = true;
            message.value = 'Dispatching workflow...';
            msgType.value = 'info';

            try {
                // Parse repo info from current URL or default (requires user to be on the deployed site)
                // For now, we assume the user might need to configure the repo name if not hosted on GH Pages of the repo
                // But typically window.location.hostname contains 'github.io'.
                // Format: <user>.github.io/<repo>
                
                let user = '';
                let repo = '';
                
                const pathParts = window.location.pathname.split('/').filter(p => p);
                // e.g. /my-repo/ or /
                
                if (window.location.hostname.includes('github.io')) {
                    user = window.location.hostname.split('.')[0];
                    repo = pathParts[0];
                } else {
                    // Fallback for local testing or custom domain - might fail without manual config
                    // Let's prompt or error if we can't guess
                     // For this specific user case:
                     // The project is locally at /Users/hsiang-lin/unsync/AIProjects/jobs_search
                     // We don't know the remote URL easily from JS.
                     // But the user provided: https://github.com/zip520123/Linkedin_Jobsearch_API
                     user = 'zip520123';
                     repo = 'Linkedin_Jobsearch_API';
                }
                
                repoUrl.value = `https://github.com/${user}/${repo}/actions`;

                // Clean config
                let configPayload;
                try {
                     configPayload = JSON.stringify(JSON.parse(configStr.value)); // Minify
                } catch (e) {
                    throw new Error('Invalid JSON in config');
                }

                const url = `https://api.github.com/repos/${user}/${repo}/actions/workflows/job-search.yml/dispatches`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `token ${pat.value}`
                    },
                    body: JSON.stringify({
                        ref: 'master', // or main
                        inputs: {
                            config: configPayload
                        }
                    })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Failed to trigger workflow');
                }

                message.value = 'Workflow triggered! Check "Actions" tab or wait ~2 mins.';
                msgType.value = 'success';

            } catch (err) {
                message.value = err.message;
                msgType.value = 'error';
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            loadResults();
        });

        return {
            pat,
            configStr,
            loading,
            message,
            msgType,
            jobs,
            generatedAt,
            repoUrl,
            triggerSearch,
            loadResults
        };
    }
}).mount('#app');
