import React from 'react'
import ReactDOM from 'react-dom'
import BackButton from './../backButton'
import checkPropTypes from 'check-prop-types'

import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import renderer from 'react-test-renderer'

describe('Testing BackButton Component', () => {
  afterEach(cleanup)

  it('renders without crashing', () => {
      const div = document.createElement('div')
      ReactDOM.render(<BackButton onBack={() => {}} />, div)
  })

  it('should not through a warning for propTypes', () => {
    const expectedProps = {
      onBack: () => {}
    };
    const propsErr = checkPropTypes(BackButton.propTypes, expectedProps, 'props', BackButton.name);
    expect(propsErr).toBeUndefined();
  })


  it('matches snapshot', () => {
      const tree = renderer.create(<BackButton onBack={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
  })
})
