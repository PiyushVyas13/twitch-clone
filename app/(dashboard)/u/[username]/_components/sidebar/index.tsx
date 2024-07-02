import {Wrapper} from './wrapper'
import {Toggle} from './toggle'
import {Navigation} from "@/app/(dashboard)/u/[username]/_components/sidebar/navigation";

export const Sidebar = () => {


    return (
        <Wrapper>
            <Toggle />
            <Navigation />
        </Wrapper>
    );
};