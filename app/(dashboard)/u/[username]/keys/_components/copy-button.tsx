"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {CheckCheck, CopyIcon} from "lucide-react";

interface CopyButtonProps {
    value: string;
}

export const CopyButton = ({value}: CopyButtonProps) => {
    const [isCopied, setCopied] = useState(false)

    const onCopy = () => {
        if(!value) return;

        setCopied(true)
        navigator.clipboard.writeText(value)
        setTimeout(() => { setCopied(false) }, 1000)
    }

    const Icon = isCopied ? CheckCheck : CopyIcon

    return (
        <Button onClick={onCopy} disabled={!value || isCopied} variant="ghost" size='sm'>
            <Icon className="h-4 w-4" />
        </Button>
    );
};