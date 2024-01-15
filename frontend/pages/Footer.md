# Footer Component Documentation

The `Footer` component is a React functional component representing the footer section of a webpage. It includes navigation links and social media icons. This component dynamically fetches social media links from the server.

## Table of Contents

- [Usage](#usage)
- [Props](#props)
- [getIcon Function](#geticon-function)

## Usage

The `Footer` component renders a footer with navigation links and social media icons. It uses state to manage the navigation links and social media links dynamically fetched from the server.

```jsx
import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Twitter, GitHub } from '@mui/icons-material';
import { getSocials } from '@/utils/API';
import { Social } from '@/components/SocialLinks';

const Footer = () => {
    let [footerLinks, setFooterLinks] = useState([
        {
            name: 'Fachschaft MNI',
            link: '/',
        },
        {
            name: 'Datenschutz',
            link: '/datenschutz',
        },
        {
            name: 'Impressum',
            link: '/impressum',
        },
        {
            name: 'Alte Protokolle',
            link: 'https://fsmni.thm.de/protokolle/protokolle.php',
        },
    ]);

    const [socials, setSocials] = useState<Social[]>([]);

    useEffect(() => {
        const fetchSocials = async () => {
            const socials = await getSocials();
            setSocials(socials);
            if (socials.length > 0) {
                const newFooter = [...footerLinks];
                newFooter[0].name = socials[0].value;
                setFooterLinks(newFooter);
            }
        };

        fetchSocials();
    }, []);

    // ... (rest of the component)
};

export default Footer;
```

## Props

### `footerLinks`

- Type: `Array`
- Default:
  ```jsx
  [
      { name: 'Fachschaft MNI', link: '/' },
      { name: 'Datenschutz', link: '/datenschutz' },
      { name: 'Impressum', link: '/impressum' },
      { name: 'Alte Protokolle', link: 'https://fsmni.thm.de/protokolle/protokolle.php' },
  ]
  ```

The `footerLinks` prop is an array of objects representing the navigation links in the footer. Each object has a `name` (displayed text) and a `link` (URL).

### `socials`

- Type: `Array`
- Default: `[]`

The `socials` prop is an array of social media links represented by the `Social` type.

## getIcon Function

The `getIcon` function returns a specific social media icon based on the provided title. This function is used internally to generate icons for social media links.

```jsx
// ... (rest of the component)

const getIcon = (title: string) => {
    switch (title) {
        case 'facebook':
            return (
                <Facebook className="cursor-pointer text-secondary hover:text-primary mx-2" />
            );
        case 'instagram':
            return (
                <Instagram className="cursor-pointer text-secondary hover:text-primary mx-2" />
            );
        case 'twitter':
            return (
                <Twitter className="cursor-pointer text-secondary hover:text-primary mx-2" />
            );
        case 'git':
            return (
                <GitHub className="cursor-pointer text-secondary hover:text-primary mx-2" />
            );
        default:
            return <div></div>;
    }
};
```

This documentation provides an overview of the `Footer` component, its usage, and the `getIcon` function for rendering links and social media icons. The component is customizable and fetches social media links dynamically from the server.