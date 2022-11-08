import { useState } from 'react'
import { Heading, Text, VStack, useToast } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import Logo from '../assets/logo.svg'
import { api } from '../services/api';

export function New() {
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    async function handlePollsCreate() {
        if (!title.trim()) {
            return toast.show({
                title: 'Informe um nome para o seu bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        try {
            setIsLoading(true)
            await api.post('/polls', { title })
            toast.show({
                title: 'Bolão criado',
                placement: 'top',
                bgColor: 'green.500'
            })
            setTitle('')
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível criar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão" />
            <VStack mt={8} mx={5} alignItems="center">
                <Logo />
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Criei seu próprio bolão da copa e compartilhe com seus amigos.
                </Heading>
                <Input
                    mb={2}
                    placeholder="Nome do bolão?"
                    onChangeText={setTitle}
                    value={title}
                />
                <Button
                    title="CRIAR BOLÃO"
                    onPress={handlePollsCreate}
                    isLoading={isLoading}
                />
                <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar seus amigos
                </Text>
            </VStack>
        </VStack>
    )
}