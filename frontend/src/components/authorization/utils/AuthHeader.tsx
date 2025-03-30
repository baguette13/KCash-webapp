import { FC } from "react"

interface AuthHeaderProps {
    text: string
}

const AuthHeader: FC<AuthHeaderProps> = ({text}) => {
    return (
        <div className="font-bold text-2xl p-2 mt-1 mb-1">
            <h1 className="text-white">{text}</h1>
        </div>
    )
}

export default AuthHeader