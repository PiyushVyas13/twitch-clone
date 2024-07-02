import {useEffect, useState} from "react";
import {toast} from "sonner";
import {createViewerToken} from "@/actions/token";
import {jwtDecode, JwtPayload} from "jwt-decode";

export const useViewerToken = (hostIdentity: string) => {
    const [token, setToken] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [identity, setIdentity] = useState<string>("");

    useEffect(() => {
        const createToken = async () => {
            try {
                const viewerToken = await createViewerToken(hostIdentity);
                setToken(viewerToken)

                const decodedToken = jwtDecode(viewerToken) as JwtPayload & { name?: string }

                console.log("Decoded toeken: ", decodedToken)

                const name = decodedToken?.name
                const identity = decodedToken.sub

                if(identity) {
                    setIdentity(identity)
                }

                if(name) {
                    setName(name)
                }

            }catch {
                toast.error("Something went wrong")
            }
        }

        createToken();
    }, [hostIdentity]);

    return {
        token,
        name,
        identity
    }
}