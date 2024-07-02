import {Skeleton} from "@/components/ui/skeleton";
import {getSearchResults} from "@/lib/search-service";
import {ResultCard} from "@/app/(browse)/search/_components/result-card";
import {ResultCardSkeleton} from "@/app/(browse)/search/_components/result-card";

interface SearchResultProps {
    term?: string;

}

export const Results = async ({term}: SearchResultProps) => {
    const data = await getSearchResults(term)

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Results for term &quot;{term}&quot;</h2>
            {data.length === 0 && (
                <p className="text-muted-foreground text-sm">
                    No results found. Try searching for something else.
                </p>
            )}
            <div className="flex flex-col gap-y-4">
                {
                    // @ts-ignore
                    data.map((result) => (
                    <ResultCard data={result} key={result.id} />
                ))}
            </div>
        </div>
    );
};

export const ResultsSkeleton = () => {
    return (
        <div>
            <Skeleton className="h-8 w-[290px] mb-4"/>
            <div className="flex flex-col gap-y-4">
                {[...Array(4)].map((_, i) => (
                    <ResultCardSkeleton key={i}/>
                ))}
            </div>
        </div>
    )
}