export const urlConfig = {
    // endpoint configs...!
    // host: 'http://localhost:3002',
    host: 'https://dev.sunbirded.org',
    apiSlug: '/discussion',
    apiBasePath: () => `${urlConfig.host}${urlConfig.apiSlug}`,

    // URLs...! 
    getAllCategories: () => `${urlConfig.apiBasePath()}/categories`,
    getSingleCategoryDetails: (cid: number) => `${urlConfig.apiBasePath()}/category/${cid}`,
    getAllTags: () => `${urlConfig.apiBasePath()}/tags`,
    getTagBasedDiscussion: (tag: string) => `${urlConfig.apiBasePath()}/tags/${tag}`,
    createPost: () => `${urlConfig.apiBasePath()}/v2/topics`,
    votePost: (pid: number) => `${urlConfig.apiBasePath()}/v2/posts/${pid}/vote`,
    replyPost: (tid: number) => `${urlConfig.apiBasePath()}/v2/topics/${tid}`,
    bookmarkPost: (pid: number) => `${urlConfig.apiBasePath()}/v2/posts/${pid}/bookmark`,
    recentPost: () => `${urlConfig.apiBasePath()}/recent`,
    popularPost: () => `${urlConfig.apiBasePath()}/popular`,
    unread: () => `${urlConfig.apiBasePath()}/topics/unread/total`,
    getTopic: () => `${urlConfig.apiBasePath()}/topic`,
    profile: () => `${urlConfig.apiBasePath()}/users/me`,
    fetchProfile: (slug: string) => `${urlConfig.apiBasePath()}/users/${slug}/about`,
    listUpVote: (slug: string) => `${urlConfig.apiBasePath()}/user/${slug}/upvoted`,
    listDownVoted: (slug: string) => `${urlConfig.apiBasePath()}/user/${slug}/downvoted`,
    listSaved: (slug: string) => `${urlConfig.apiBasePath()}/user/${slug}/bookmarks`,
    fetchNetworkProfile: `user/profileDetails/getUserRegistry`,
    userDetails: (username: string) => `${urlConfig.apiBasePath()}/user/${username}`,
    getContextBasedTopics: (slug: string) => `${urlConfig.apiBasePath()}/category/${slug}`,
    registerUser: () => `${urlConfig.apiBasePath()}/user/v1/create`,
    getContextBasedDiscussion: () => `${urlConfig.apiBasePath()}/category/list`,
    getContextBasedTagDiscussion: () => `${urlConfig.apiBasePath()}/tags/list`
};
