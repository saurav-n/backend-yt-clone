import { useSuspenseQuery,  useSuspenseInfiniteQuery ,QueryFunction, useQueryClient } from '@tanstack/react-query'

function createGlobalState<T>(getQueryFn:(identifier:string|null)=> QueryFunction<T>, key: string[]) {
    return (identiFier='') => {
        const queryClient = useQueryClient()

        const query = useSuspenseQuery({
            queryKey: identiFier?[...key,identiFier]:key,
            queryFn: getQueryFn(identiFier),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchIntervalInBackground: false,
        })


        function refecthData() {
            queryClient.invalidateQueries({
                queryKey: identiFier?[...key,identiFier]:key,
            })
            queryClient.refetchQueries({
                queryKey: identiFier?[...key,identiFier]:key,
            })
        }


        return { data: query.data, isFetching: query.isFetching, refecthData }
    }
}

function createPaginatedGlobalState<T>(getQueryFn: (identifier?:string)=>QueryFunction<T, string[], unknown>, key: string[],getNextPageParam:(lastPage:T,allPages:T[])=>number|undefined) {
    return (identifier?:string) => {
        const queryClient=useQueryClient()
        const query = useSuspenseInfiniteQuery({
            queryKey: identifier?[...key,identifier]:key,
            queryFn: getQueryFn(identifier),
            getNextPageParam:getNextPageParam,
            initialPageParam: 1
        })

        function refecthData() {
            queryClient.invalidateQueries({
                queryKey: identifier?[...key,identifier]:key,
            })
            queryClient.refetchQueries({
                queryKey: identifier?[...key,identifier]:key,
            })
        }


        return {...query,refecthData}
    }
}

    export {
        createGlobalState,
        createPaginatedGlobalState
    }