type PromptType = {
    username: string,
    repo: number,
    followers: number,
    id: number
}

export const prompt = ({username, repo, followers, id } : PromptType): string => {

return  `${username} who have ${repo} github repositories and have ${followers} followers on github and ${username}'s github id is ${id}`;

}