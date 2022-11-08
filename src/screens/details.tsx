import { useEffect, useState } from 'react'
import { Share } from 'react-native'
import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from '@react-navigation/native'
import { Loading } from '../components/Loading';
import { api } from '../services/api';
import { PollCardProps } from '../components/PollCard'
import { PollHeader } from '../components/PollHeader';
import { EmptyMyPollList } from '../components/EmptyMyPollList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';
interface RouteParams {
    id: string
}
export function Details() {
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(true)
    const [pollDetails, setPollDetais] = useState<PollCardProps>({} as PollCardProps)
    const [optionSelected, setOptionSelected] = useState<'Seus palpites' | 'Ranking'>('Seus palpites')
    const { id } = route.params as RouteParams
    const toast = useToast()
    async function fetchPollDetais() {
        try {
            setIsLoading(true)
            const response = await api.get(`/polls/${id}`)
            setPollDetais(response.data.poll)
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível carregar os detalhes',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchPollDetais()
    }, [id])
    async function hanldeCodeShare() {
        await Share.share({
            message: pollDetails.code
        })
    }
    if (isLoading) {
        return (
            <Loading />
        )
    }
    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title={pollDetails.title} showBackButton showShareButton onShare={hanldeCodeShare} />
            {
                pollDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1}>
                        <PollHeader data={pollDetails} />
                        <HStack bgColor='gray.800' p={1} rounded="sm" mb={5}>
                            <Option title="Seus palpites" isSelected={optionSelected === 'Seus palpites'} onPress={() => setOptionSelected("Seus palpites")} />
                            <Option title="Ranking" isSelected={optionSelected === 'Ranking'} onPress={() => setOptionSelected("Ranking")} />
                        </HStack>
                        <Guesses pollId={pollDetails.id} code={pollDetails.code} />
                    </VStack>
                    :
                    <EmptyMyPollList code={pollDetails.code} />
            }
        </VStack>
    )
}