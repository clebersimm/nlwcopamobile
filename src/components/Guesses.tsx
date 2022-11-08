import { useEffect, useState } from 'react'
import { FlatList, useToast } from 'native-base';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPollList } from './EmptyMyPollList';

interface Props {
  pollId: string;
  code: string
}

export function Guesses({ pollId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const toast = useToast()
  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/polls/${pollId}/games`)
      console.log(response.data.games)
      setGames(response.data.games)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchGames()
  }, [pollId])
  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true)
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })
      toast.show({
        title: 'Tudo ok',
        placement: 'top',
        bgColor: 'green.500'
      })
      fetchGames()
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      toast.show({
        title: 'Não foi possível enviar palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }
  if (isLoading) {
    return <Loading />
  }
  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
