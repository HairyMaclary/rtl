import React from 'react';
import user from '@testing-library/user-event'
import { render, fireEvent, wait} from '@testing-library/react';
import { FavoriteNumber } from './favorite-number'; 
import { GreetingLoader } from './greeting-loader';
import { loadGreeting as mockLoadGreeting } from './api'

jest.mock('./api') // all functions exposed in this module are mocked

test('favourite number allows the correct input range', () => {
  const { getByLabelText, getByRole, queryByRole, rerender} = render(<FavoriteNumber />);
  const input = getByLabelText(/favorite number/i);
  expect(input).toHaveValue(0)
  fireEvent.change(input, { target: { value: 5 } })
  expect(input).toHaveValue(5);
  expect(queryByRole('alert')).not.toBeInTheDocument()
  fireEvent.change(input, { target: { value: 10 } })
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  fireEvent.change(input, { target: { value: -1 } })
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  user.type(input, '3')
  expect(queryByRole('alert')).not.toBeInTheDocument()
  rerender(<FavoriteNumber max={10}/>)
  user.type(input, '10')
  expect(input).toHaveValue(10);
  expect(queryByRole('alert')).not.toBeInTheDocument()
});

test('load greetings on click', async () => {
  const userName = 'Bob';
  const testGreeting = 'TEST_GREETING';

  mockLoadGreeting.mockResolvedValueOnce({data: { greeting: testGreeting}})

  const { getByText, getByLabelText } = render(<GreetingLoader />);
  const input = getByLabelText(/name/i)
  user.type(input, userName);
  const button = getByText('Load Greeting')
  user.click(button)
  
  expect(mockLoadGreeting).toHaveBeenCalledWith(userName)
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  
  await wait(() => {
    expect(getByLabelText(/greeting/i)).toHaveTextContent(testGreeting);
  })
});
