import {Loader} from "lucide-react";

interface LoadingVideoProps {
    label: string;
}

export const LoadingVideo = ({label} : LoadingVideoProps) => {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Loader className="h-10 w-10 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground capitalize">
                {label}
            </p>
        </div>
    );
};