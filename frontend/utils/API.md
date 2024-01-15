# API Utils Documentation

The following documentation provides an overview of the utility functions used for API communication in a Next.js application. These utility functions handle various tasks such as fetching data, sending requests, managing user information, displaying notifications, and more.

## Table of Contents

1. [State Management](#state-management)
2. [Notification](#notification)
3. [API Requests](#api-requests)
4. [Protocol-related Functions](#protocol-related-functions)
5. [User-related Functions](#user-related-functions)
6. [Session Functions](#session-functions)
7. [Attendee Functions](#attendee-functions)
8. [Email Template Functions](#email-template-functions)
9. [Legal Information Functions](#legal-information-functions)

## State Management

### `store`

- Type: Zustand store
- Description: A Zustand store used for managing the state of the user in the application.

### `User`

- Type: Interface
- Description: Represents the structure of user data.

### `Role`

- Type: Type alias
- Description: Represents possible user roles, either "Administrator" or "Recorder."

### `State`

- Type: Interface
- Description: Represents the overall state of the application, including the user.

## Notification

### `notify(msg: string)`

- Parameters:
    - `msg`: String - The message to be displayed in the notification.
- Description: Displays a notification using the `react-toastify` library.

## API Requests

### `get(url: string)`

- Parameters:
    - `url`: String - The URL for the GET request.
- Returns: Promise\<any>
- Description: Performs a GET request to the specified URL and returns the JSON response.

### `del(url: string)`

- Parameters:
    - `url`: String - The URL for the DELETE request.
- Returns: Promise\<Response>
- Description: Performs a DELETE request to the specified URL.

### `put(url: string, json: any)`

- Parameters:
    - `url`: String - The URL for the PUT request.
    - `json`: Object - The JSON payload for the PUT request.
- Returns: Promise\<Response>
- Description: Performs a PUT request to the specified URL with the provided JSON payload.

### `post(url: string, json: any)`

- Parameters:
    - `url`: String - The URL for the POST request.
    - `json`: Object - The JSON payload for the POST request.
- Returns: Promise\<Response>
- Description: Performs a POST request to the specified URL with the provided JSON payload.

## Protocol-related Functions

### `getProtocolTypes()`

- Returns: Promise\<ProtocolType[]>
- Description: Fetches the available protocol types from the API.

### `setProtoclTypes(protocolTemplates: string[], protocolNames: string[])`

- Parameters:
    - `protocolTemplates`: String[] - Array of protocol templates.
    - `protocolNames`: String[] - Array of protocol names.
- Returns: Promise\<Response>
- Description: Sets the protocol types with the provided templates and names.

### `getProtocols(page = 0, limit = 20)`

- Parameters:
    - `page`: Number - Page number for pagination (default: 0).
    - `limit`: Number - Number of protocols per page (default: 20).
- Returns: Promise\<Protocol[]>
- Description: Fetches protocols from the API with optional pagination.

## User-related Functions

### `loadToken()`

- Description: Loads the user token from localStorage and sets the user if the token is still valid.

### `getUsers()`

- Returns: Promise\<User[]>
- Description: Fetches the list of users from the API.

### `setRole(userId: string, role: Role)`

- Parameters:
    - `userId`: String - ID of the user.
    - `role`: Role - Role to be set ("Administrator" or "Recorder").
- Returns: Promise\<Response>
- Description: Sets the specified role for the user.

### `removeRole(userId: string, role: Role)`

- Parameters:
    - `userId`: String - ID of the user.
    - `role`: Role - Role to be removed ("Administrator" or "Recorder").
- Returns: Promise\<Response>
- Description: Removes the specified role for the user.

## Session Functions

### `startSession()`

- Returns: Promise\<Response>
- Description: Initiates a new session.

### `sessionRunning()`

- Returns: Promise\<Boolean>
- Description: Checks if a session is currently active.

### `deleteSession()`

- Returns: Promise\<Response>
- Description: Ends the current session.

### `getAttendees()`

- Returns: Promise\<String[]>
- Description: Fetches the list of attendees from the current session.

### `addAttendees(name: string)`

- Parameters:
    - `name`: String - Name of the attendee to be added.
- Returns: Promise\<Response>
- Description: Adds a new attendee to the current session.

## Attendee Functions

### `getAttendees()`

- Returns: Promise\<String[]>
- Description: Fetches the list of attendees from the API.

### `addAttendees(name: string)`

- Parameters:
    - `name`: String - Name of the attendee to be added.
- Returns: Promise\<Response>
- Description: Adds a new attendee to the list.

## Email Template Functions

### `getTemplates()`

- Returns: Promise\<any>
- Description: Fetches the email templates from the API.

### `setTemplate(template: any)`

- Parameters:
    - `template`: Object - Email template to be set.
- Returns: Promise\<Response>
- Description: Sets the email template.

### `isSendingMails()`

- Returns: Promise\<Boolean>
- Description: Checks if the email dispatch feature is enabled.

### `setSendingMails(value: boolean)`

- Parameters:
    - `value`: Boolean - Value to set for the email dispatch feature.
- Returns: Promise\<Response>
- Description: Enables or disables the email dispatch feature.

## Legal Information Functions

### `getLegals()`

- Returns: Promise\<any>
- Description: Fetches legal information from the API.

### `setLegals(legal: any)`

- Parameters:
    - `legal`: Object - Legal information to be set.
- Returns: Promise\<Response>
- Description

  : Sets the legal information.

This documentation provides an overview of the utility functions used for API communication in a Next.js application. These functions cover a wide range of tasks, including state management, notification handling, API requests, and various functionalities related to protocols, users, sessions, attendees, email templates, and legal information.