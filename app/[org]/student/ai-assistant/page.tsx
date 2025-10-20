'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, HelpCircle, Lightbulb, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

type Message = {
	role: 'user' | 'assistant'
	content: string
}

const suggestions = [
	{ icon: BookOpen, text: 'Explain neural networks in simple terms' },
	{ icon: HelpCircle, text: 'Help me with JavaScript closures' },
	{ icon: Lightbulb, text: 'Give me study tips for data structures' },
]

export default function AIAssistantPage() {
	const [messages, setMessages] = useState<Message[]>([
		{
			role: 'assistant',
			content:
				"Hello! I'm your AI study assistant. I can help you understand concepts, answer questions, and provide study recommendations. How can I help you today?",
		},
	])
	const [input, setInput] = useState('')
	const [isTyping, setIsTyping] = useState(false)

	const sendMessage = (text: string) => {
		if (!text.trim()) return

		const userMessage: Message = { role: 'user', content: text }
		setMessages(prev => [...prev, userMessage])
		setInput('')
		setIsTyping(true)

		// Simulate AI response
		setTimeout(() => {
			const assistantMessage: Message = {
				role: 'assistant',
				content: `I understand you're asking about "${text}". Let me help you with that.\n\nThis is a simulated response. In a real implementation, this would connect to an AI model to provide detailed explanations, examples, and study guidance tailored to your question.\n\nWould you like me to:\n• Provide more examples\n• Explain related concepts\n• Suggest practice exercises`,
			}
			setMessages(prev => [...prev, assistantMessage])
			setIsTyping(false)
		}, 1500)
	}

	return (
		<div className='space-y-6 h-[calc(100vh-12rem)]'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					AI Study Assistant
				</h1>
				<p className='text-muted-foreground mt-1'>
					Get instant help with your studies
				</p>
			</div>

			<div
				className='grid gap-4 h-full'
				style={{ gridTemplateRows: 'auto 1fr auto' }}
			>
				{/* Suggestions */}
				{messages.length === 1 && (
					<div className='grid gap-3 md:grid-cols-3'>
						{suggestions.map((suggestion, index) => (
							<Card
								key={index}
								className='p-4 cursor-pointer hover:border-primary/50 transition-colors'
								onClick={() => sendMessage(suggestion.text)}
							>
								<div className='flex items-start gap-3'>
									<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
										<suggestion.icon className='w-5 h-5 text-primary' />
									</div>
									<p className='text-sm font-medium'>{suggestion.text}</p>
								</div>
							</Card>
						))}
					</div>
				)}

				{/* Chat Messages */}
				<Card className='flex-1 overflow-hidden'>
					<ScrollArea className='h-full p-6'>
						<div className='space-y-4'>
							{messages.map((message, index) => (
								<div
									key={index}
									className={`flex gap-3 ${
										message.role === 'user' ? 'justify-end' : ''
									}`}
								>
									{message.role === 'assistant' && (
										<div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
											<Sparkles className='w-4 h-4 text-primary' />
										</div>
									)}
									<div
										className={`max-w-[80%] rounded-2xl px-4 py-3 ${
											message.role === 'user'
												? 'bg-primary text-primary-foreground'
												: 'bg-muted text-foreground'
										}`}
									>
										<p className='text-sm whitespace-pre-wrap leading-relaxed'>
											{message.content}
										</p>
									</div>
									{message.role === 'user' && (
										<div className='w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0'>
											<span className='text-sm font-medium text-accent'>
												You
											</span>
										</div>
									)}
								</div>
							))}
							{isTyping && (
								<div className='flex gap-3'>
									<div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
										<Sparkles className='w-4 h-4 text-primary' />
									</div>
									<div className='bg-muted rounded-2xl px-4 py-3'>
										<div className='flex gap-1'>
											<div className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce' />
											<div className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]' />
											<div className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]' />
										</div>
									</div>
								</div>
							)}
						</div>
					</ScrollArea>
				</Card>

				{/* Input */}
				<Card className='p-4'>
					<form
						onSubmit={e => {
							e.preventDefault()
							sendMessage(input)
						}}
						className='flex gap-2'
					>
						<Input
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder='Ask me anything about your courses...'
							className='flex-1'
						/>
						<Button
							type='submit'
							size='icon'
							disabled={!input.trim() || isTyping}
						>
							<Send className='w-4 h-4' />
						</Button>
					</form>
				</Card>
			</div>
		</div>
	)
}
