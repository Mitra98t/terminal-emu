function Prompt({ user }) {
    return (
        <div className="min-w-fit flex flex-row gap-2 items-start justify-start text-white">
            <div className="min-w-fit min-h-fit flex flex-row">
                <p className="text-green font-bold">{user().userName}</p><p className="text-lightBlue ">@wow.com</p>
            </div>
            <p className="font-bold">~</p>
        </div>
    )
}

export default Prompt;