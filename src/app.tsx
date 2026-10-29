import Loading from '@components/loading/loading'
import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/home/home'))

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="*"
					element={
						<Suspense fallback={<Loading />}>
							<Home />
						</Suspense>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
