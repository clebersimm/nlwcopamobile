import { useState } from 'react'
import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import Logo from '../assets/logo.svg'
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';
export function Find() {
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState('')
    const toast = useToast()
    const { navigate } = useNavigation()
    async function handleJoinPoll() {
        try {
            setIsLoading(true)
            if (!code.trim) {
                return toast.show({
                    title: 'Informe o código',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
            await api.post('/polls/join', { code })
            toast.show({
                title: 'Novo Bolão!',
                placement: 'top',
                bgColor: 'green.500'
            })
            setIsLoading(false)
            navigate('polls')
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            if (error.response?.data?.message) {
                return toast.show({
                    title: error.response.data.message,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
        }
    }
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar bolão" showBackButton />
            <VStack mt={8} mx={5} alignItems="center">
                <Logo />
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Encontre um bolão através de seu código
                </Heading>
                <Input mb={2} placeholder="Qual código do bolão?" onChangeText={setCode} autoCapitalize="characters" />
                <Button title="BUSCAR BOLÃO" isLoading={isLoading} onPress={handleJoinPoll} />
            </VStack>
        </VStack>
    )
}