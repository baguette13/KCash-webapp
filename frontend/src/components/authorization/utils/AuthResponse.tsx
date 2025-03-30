import { FC, useEffect, useState } from "react";

interface AuthResponseProps {
    text: string;
    color: string;
    isVisible: boolean;
}

const AuthResponse: FC<AuthResponseProps> = ({ text, color, isVisible }) => {
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setVisibility(true);
        } else {
            setTimeout(() => setVisibility(false), 600);
        }
    }, [isVisible]);

    return (
        <div
            className={`mt-1 mb-1 pt-1 pb-1 pr-4 pl-4 rounded-2xl ${color} 
                transform ${visibility ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-3 opacity-0 scale-90'}
                transition-all duration-1000 ease-out`}
        >
            <p className="text-white text-sm text-center">{text}</p>
        </div>
    );
};

export default AuthResponse;
