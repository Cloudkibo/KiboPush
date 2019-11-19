import React from 'react'
import ReactDOM from 'react-dom'
import AlertMessage from './../alertMessage'

import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import renderer from 'react-test-renderer'

afterEach(cleanup)

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<AlertMessage></AlertMessage>, div)
})

it('renders alert message correctly for page type', () => {
      const {getByTestId} = render(<AlertMessage type='page'></AlertMessage>)
      expect(getByTestId('alertMessage')).toHaveTextContent("0 Pages Connected! You have no pages connected. Please connect your facebook page to use this feature.")
})

it('renders alert message correctly for subscriber type', () => {
    const {getByTestId} = render(<AlertMessage type='subscriber'></AlertMessage>)
    expect(getByTestId('alertMessage')).toHaveTextContent("0 Subscribers! Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast message, polls and surveys.")
})

it('matches snapshot for type page', () => {
    const tree = renderer.create(<AlertMessage type='page'></AlertMessage>).toJSON()
    expect(tree).toMatchSnapshot() 
})

it('matches snapshot for type subscriber', () => {
    const tree = renderer.create(<AlertMessage type='subscriber'></AlertMessage>).toJSON()
    expect(tree).toMatchSnapshot() 
})