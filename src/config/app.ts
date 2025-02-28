interface AppConfig {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfig = {
  name: "",
  github: {
    title: "",
    url: "",
  },
  author: {
    name: "",
    url: "",
  },
};