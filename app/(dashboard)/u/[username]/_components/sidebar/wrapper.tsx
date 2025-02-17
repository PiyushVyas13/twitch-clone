"use client"

import React from "react";
import {useCreatorSidebar} from "@/store/use-creator-sidebar";
import {cn} from "@/lib/utils";

export const Wrapper = ({children}: {children: React.ReactNode}) => {
    const {collapsed, onExpand, onCollapse} = useCreatorSidebar(state => state)

    return (
        <aside className={cn("fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50", collapsed && "lg:w-[70px]")}>
            {children}
        </aside>
    );
};