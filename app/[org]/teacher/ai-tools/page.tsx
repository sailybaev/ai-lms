'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, FileQuestion, Lightbulb, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function AIToolsPage() {
	const [generating, setGenerating] = useState(false)
	const [result, setResult] = useState('')
	const [activeTab, setActiveTab] = useState('quiz')

	const generateContent = (type: string) => {
		setGenerating(true)
		setTimeout(() => {
			if (type === 'quiz') {
				setResult(`Generated Quiz Questions:

1. What is the primary purpose of a neural network activation function?
   a) To normalize input data
   b) To introduce non-linearity into the model
   c) To reduce overfitting
   d) To speed up training
   
   Correct Answer: b) To introduce non-linearity into the model

2. Which optimization algorithm is most commonly used in deep learning?
   a) Gradient Descent
   b) Adam
   c) SGD
   d) RMSprop
   
   Correct Answer: b) Adam

3. What is the purpose of dropout in neural networks?
   a) To increase model complexity
   b) To prevent overfitting
   c) To speed up training
   d) To normalize outputs
   
   Correct Answer: b) To prevent overfitting`)
			} else if (type === 'summary') {
				setResult(`Lesson Summary:

Introduction to Neural Networks

Key Concepts:
• Neural networks are computational models inspired by biological neurons
• They consist of layers: input, hidden, and output layers
• Each connection has a weight that is adjusted during training
• Activation functions introduce non-linearity

Main Topics Covered:
1. Architecture of neural networks
2. Forward propagation
3. Backpropagation algorithm
4. Common activation functions (ReLU, Sigmoid, Tanh)
5. Loss functions and optimization

Practical Applications:
- Image classification
- Natural language processing
- Time series prediction
- Recommendation systems`)
			} else {
				setResult(`Suggested Topics for Next Lessons:

1. Convolutional Neural Networks (CNNs)
   - Perfect follow-up to basic neural networks
   - High student interest in computer vision
   - Practical applications in image recognition

2. Recurrent Neural Networks (RNNs)
   - Natural progression for sequence data
   - Applications in NLP and time series
   - Foundation for advanced topics like LSTMs

3. Transfer Learning
   - Practical and immediately applicable
   - Reduces training time and resources
   - Popular in industry applications

4. Model Optimization Techniques
   - Addresses common student questions
   - Improves model performance
   - Includes regularization and hyperparameter tuning`)
			}
			setGenerating(false)
		}, 2000)
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>AI Tools</h1>
				<p className='text-muted-foreground mt-1'>
					Enhance your teaching with AI-powered tools
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-3'>
				<Card
					className={`p-6 cursor-pointer transition-all ${
						activeTab === 'quiz'
							? 'border-primary bg-primary/5'
							: 'hover:border-primary/50'
					}`}
					onClick={() => setActiveTab('quiz')}
				>
					<div className='space-y-3'>
						<div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
							<FileQuestion className='w-6 h-6 text-primary' />
						</div>
						<div>
							<h3 className='font-semibold'>Generate Quiz</h3>
							<p className='text-sm text-muted-foreground mt-1'>
								Create quiz questions from your lesson content
							</p>
						</div>
					</div>
				</Card>

				<Card
					className={`p-6 cursor-pointer transition-all ${
						activeTab === 'summary'
							? 'border-primary bg-primary/5'
							: 'hover:border-primary/50'
					}`}
					onClick={() => setActiveTab('summary')}
				>
					<div className='space-y-3'>
						<div className='w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center'>
							<BookOpen className='w-6 h-6 text-accent' />
						</div>
						<div>
							<h3 className='font-semibold'>Summarize Lesson</h3>
							<p className='text-sm text-muted-foreground mt-1'>
								Generate concise summaries of your lessons
							</p>
						</div>
					</div>
				</Card>

				<Card
					className={`p-6 cursor-pointer transition-all ${
						activeTab === 'topics'
							? 'border-primary bg-primary/5'
							: 'hover:border-primary/50'
					}`}
					onClick={() => setActiveTab('topics')}
				>
					<div className='space-y-3'>
						<div className='w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center'>
							<Lightbulb className='w-6 h-6 text-chart-2' />
						</div>
						<div>
							<h3 className='font-semibold'>Suggest Topics</h3>
							<p className='text-sm text-muted-foreground mt-1'>
								Get AI recommendations for next lessons
							</p>
						</div>
					</div>
				</Card>
			</div>

			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='flex items-center gap-2'>
						<Sparkles className='w-5 h-5 text-primary' />
						<h3 className='text-lg font-semibold'>
							{activeTab === 'quiz'
								? 'Quiz Generator'
								: activeTab === 'summary'
								? 'Lesson Summarizer'
								: 'Topic Suggestions'}
						</h3>
					</div>

					<div className='space-y-4'>
						{activeTab === 'quiz' && (
							<>
								<div className='space-y-2'>
									<Label htmlFor='lesson-content'>Lesson Content</Label>
									<Textarea
										id='lesson-content'
										placeholder='Paste your lesson content here...'
										rows={6}
									/>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='num-questions'>Number of Questions</Label>
										<Input id='num-questions' type='number' defaultValue='5' />
									</div>
									<div className='space-y-2'>
										<Label htmlFor='difficulty'>Difficulty Level</Label>
										<Select defaultValue='medium'>
											<SelectTrigger id='difficulty'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='easy'>Easy</SelectItem>
												<SelectItem value='medium'>Medium</SelectItem>
												<SelectItem value='hard'>Hard</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</>
						)}

						{activeTab === 'summary' && (
							<div className='space-y-2'>
								<Label htmlFor='lesson-text'>Lesson Text</Label>
								<Textarea
									id='lesson-text'
									placeholder='Enter the full lesson text to summarize...'
									rows={8}
								/>
							</div>
						)}

						{activeTab === 'topics' && (
							<>
								<div className='space-y-2'>
									<Label htmlFor='current-topic'>Current Topic</Label>
									<Input
										id='current-topic'
										placeholder='e.g., Introduction to Neural Networks'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='course-level'>Course Level</Label>
									<Select defaultValue='intermediate'>
										<SelectTrigger id='course-level'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='beginner'>Beginner</SelectItem>
											<SelectItem value='intermediate'>Intermediate</SelectItem>
											<SelectItem value='advanced'>Advanced</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</>
						)}

						<Button
							onClick={() => generateContent(activeTab)}
							disabled={generating}
							className='w-full gap-2'
						>
							<Sparkles className='w-4 h-4' />
							{generating ? 'Generating...' : 'Generate with AI'}
						</Button>
					</div>

					{result && (
						<div className='space-y-2 pt-4'>
							<Label>Generated Result</Label>
							<Textarea
								value={result}
								readOnly
								rows={15}
								className='font-mono text-sm'
							/>
							<div className='flex gap-2'>
								<Button variant='outline' size='sm'>
									Copy to Clipboard
								</Button>
								<Button variant='outline' size='sm'>
									Export as PDF
								</Button>
							</div>
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
