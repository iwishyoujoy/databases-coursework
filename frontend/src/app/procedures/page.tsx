'use client'
import { CardContainer } from "../components/CardContainer";
import { Categories } from "../components/Categories";
import { DesktopWrapper } from "../components/DesktopWrapper";

export default function Page() {
    return (
        <>
        <Categories categoryType="procedureCategory"/>
        <DesktopWrapper>
            <CardContainer categoryType="procedureCategory"/>
        </DesktopWrapper>
        </>
    )
}
