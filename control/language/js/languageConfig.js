const languageConfig = {
    screenOne: {
        title: "Screen One",
        labels: {
            loading: {
                title: "loading",
                placeholder: "loading...",
                defaultValue: "loading...",
                maxLength: 60,
            },
            sort: {
                title: "A to Z",
                placeholder: "enter message here",
                defaultValue: "Welcome to your app",
                maxLength: 500,
                required: true,
            },
        }
    },
    screenTwo: {
        title: "Screen Two",
        labels: {
            noMatches: {
                title: "Message to show when no matches found.",
                placeholder: "enter message here",
                defaultValue: "Sorry no matches found. Please try again latter",
                maxLength: 600,
            },
        },
    }
};