const { createApp, ref, onMounted, watch, computed } = Vue;

createApp({
    setup() {
        const pat = ref(localStorage.getItem('github_pat') || '');
        const loading = ref(false);
        const message = ref('');
        const msgType = ref('info');
        const jobs = ref([]);
        const generatedAt = ref('-');
        const repoUrl = ref('');
        const mode = ref('visual'); // 'visual' or 'json'

        // Default Config Object
        const defaultConfig = {
            searches: [
                // London searches
                {
                    name: 'Senior iOS Engineer - London',
                    keyword: 'Senior iOS Engineer',
                    location: 'London, United Kingdom',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },
                {
                    name: 'iOS Developer - London',
                    keyword: 'iOS Developer',
                    location: 'London, United Kingdom',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },

                // Amsterdam searches
                {
                    name: 'Senior iOS Engineer - Amsterdam',
                    keyword: 'Senior iOS Engineer',
                    location: 'Amsterdam, Netherlands',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },
                {
                    name: 'iOS Developer - Amsterdam',
                    keyword: 'iOS Developer',
                    location: 'Amsterdam, Netherlands',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },

                // Copenhagen/Denmark searches
                {
                    name: 'Senior iOS Engineer - Copenhagen',
                    keyword: 'Senior iOS Engineer',
                    location: 'Copenhagen, Denmark',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },
                {
                    name: 'iOS Developer - Copenhagen',
                    keyword: 'iOS Developer',
                    location: 'Copenhagen, Denmark',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },

                // Stockholm/Sweden searches
                {
                    name: 'Senior iOS Engineer - Stockholm',
                    keyword: 'Senior iOS Engineer',
                    location: 'Stockholm, Sweden',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },
                {
                    name: 'iOS Developer - Stockholm',
                    keyword: 'iOS Developer',
                    location: 'Stockholm, Sweden',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },

                // Helsinki/Finland searches
                {
                    name: 'Senior iOS Engineer - Helsinki',
                    keyword: 'Senior iOS Engineer',
                    location: 'Helsinki, Finland',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },
                {
                    name: 'iOS Developer - Helsinki',
                    keyword: 'iOS Developer',
                    location: 'Helsinki, Finland',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },

                // UAE searches
                {
                    name: 'Senior iOS Engineer - UAE',
                    keyword: 'Senior iOS Engineer',
                    location: 'United Arab Emirates',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                },
                {
                    name: 'iOS Developer - UAE',
                    keyword: 'iOS Developer',
                    location: 'United Arab Emirates',
                    dateSincePosted: '24hr',
                    jobType: 'full time',
                    remoteFilter: '',
                    experienceLevel: 'senior',
                    limit: '25',
                    salary: ''
                }
            ],
            filters: {
                titleKeywords: ['ios', 'swift', 'swiftui', 'uikit'],
                excludeCompanies: [],
                preferredKeywords: ['swift', 'swiftui', 'uikit', 'mvvm', 'rxswift', 'combine', 'tdd', 'ci/cd', 'fastlane', 'senior', 'lead', 'architect'],
                minSalary: 0
            }
        };

        const config = ref(defaultConfig);
        const configJsonStr = ref(JSON.stringify(defaultConfig, null, 2));

        // Save PAT to local storage
        watch(pat, (newVal) => {
            localStorage.setItem('github_pat', newVal);
        });

        // Toggle between Visual and JSON modes
        const toggleMode = (newMode) => {
            if (newMode === 'json') {
                // Visual -> JSON: Sync object to string
                configJsonStr.value = JSON.stringify(config.value, null, 2);
            } else {
                // JSON -> Visual: Try to parse string to object
                try {
                    config.value = JSON.parse(configJsonStr.value);
                } catch (e) {
                    alert("Invalid JSON in the editor. Please fix errors before switching back to Visual mode.");
                    return; // Abort switch
                }
            }
            mode.value = newMode;
        };

        // UI Helpers for Visual Editor
        const addSearch = () => {
            config.value.searches.push({
                name: 'New Search',
                keyword: '',
                location: '',
                dateSincePosted: '24hr',
                limit: '25'
            });
        };

        const removeSearch = (index) => {
            config.value.searches.splice(index, 1);
        };

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
                let user = '';
                let repo = '';
                
                const pathParts = window.location.pathname.split('/').filter(p => p);
                
                if (window.location.hostname.includes('github.io')) {
                    user = window.location.hostname.split('.')[0];
                    repo = pathParts[0];
                } else {
                     user = 'zip520123';
                     repo = 'Linkedin_Jobsearch_API';
                }
                
                repoUrl.value = `https://github.com/${user}/${repo}/actions`;

                // Prepare Payload
                let configPayload;
                try {
                    if (mode.value === 'json') {
                        // Validate JSON before sending
                        configPayload = JSON.stringify(JSON.parse(configJsonStr.value));
                    } else {
                        configPayload = JSON.stringify(config.value);
                    }
                } catch (e) {
                    throw new Error('Invalid Configuration JSON');
                }

                const url = `https://api.github.com/repos/${user}/${repo}/actions/workflows/job-search.yml/dispatches`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `token ${pat.value}`
                    },
                    body: JSON.stringify({
                        ref: 'master', 
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
            config,
            configJsonStr,
            mode,
            loading,
            message,
            msgType,
            jobs,
            generatedAt,
            repoUrl,
            toggleMode,
            addSearch,
            removeSearch,
            triggerSearch,
            loadResults
        };
    }
}).mount('#app');
