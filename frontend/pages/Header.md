# Header Component Documentation

The `Header` component is a React functional component representing the header section of a webpage. It includes a logo, navigation links, and a user icon. The header is responsive, with a hamburger menu for smaller screens.

## Table of Contents

- [Usage](#usage)
- [Props](#props)

## Usage

The `Header` component renders a header with a logo, navigation links, and a user icon. It dynamically fetches the logo, determines the available navigation links based on the user's role, and adjusts the layout for responsive design.

```jsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Close, Menu } from '@mui/icons-material';
import UserIcon from '@/components/UserIcon';
import { getLogo, getSocials, loadToken, sessionRunning, store } from '@/utils/API';

const Header = () => {
    const [links, setLinks] = useState([{ name: 'Protokolle', link: '/' }]);
    const [open, setOpen] = useState(false);
    const user = store((s) => s.user);
    const [logo, setLogo] = useState('/fsmniLogo.png');

    useEffect(() => {
        const fetchLogo = async () => {
            setLogo(await getLogo());
        };
        fetchLogo();
    }, []);

    useEffect(() => {
        loadToken();
    }, []);

    useEffect(() => {
        const loadLinks = async () => {
            const links = [{ name: 'Protokolle', link: '/' }];
            if (user) {
                if (user.isAdmin)
                    links.push({
                        name: 'Admin',
                        link: '/admin',
                    });
                if (user.isRecorder)
                    links.push({
                        name: 'Neu',
                        link: '/new',
                    });
            }
            if (!(await sessionRunning())) {
                setLinks(links);
                return;
            }
            links.push({ name: 'Beitreten', link: '/enter' });
            const socials = await getSocials();
            const room = socials.find((x) => x.title === 'meeting-room');
            if (room && room.value) {
                links.push({ name: 'Meeting Room', link: room.value });
            }
            setLinks(links);
        };
        loadLinks();
    }, [user]);

    return (
        <div className="w-full top-0 left-0 h-[100px]">
            <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
                <Link href="/">
                    <Image src={logo} alt="Logo" width={250} height={50} />
                </Link>

                <div
                    onClick={() => setOpen(!open)}
                    className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
                >
                    {open ? <Close /> : <Menu />}
                </div>
                <ul
                    className={`ml-auto md:flex md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-10 left-0 w-full md:w-auto transition-all duration-500 ease-in ${
                        open ? 'top-[110px]' : 'top-[-500px]'
                    }`}
                >
                    {links.map((link) => (
                        <div key={link.name} className="flex items-center justify-center">
                            <a
                                href={link.link}
                                className="text-primary hover:text-secondary duration-500 p-2 text-xl"
                            >
                                {link.name}
                            </a>
                        </div>
                    ))}
                    <div className="flex items-center justify-center ml-4">
                        <UserIcon />
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Header;
```

## Props

### `links`

- Type: `Array`
- Default:
  ```jsx
  [
      { name: 'Protokolle', link: '/' },
  ]
  ```

The `links` prop is an array of objects representing the navigation links in the header. Each object has a `name` (displayed text) and a `link` (URL).

### `open`

- Type: `Boolean`
- Default: `false`

The `open` prop is a boolean indicating whether the mobile menu is open (`true`) or closed (`false`). This prop is used to control the visibility of the mobile menu.

### `user`

- Type: `Object`
- Default: `null`

The `user` prop represents the user object with information about the current user. If no user is logged in, the value is `null`. The user object includes properties such as `isAdmin` and `isRecorder`.

### `logo`

- Type: `String`
- Default: `'/fsmniLogo.png'`

The `logo` prop is a string representing the URL of the logo image. It is dynamically fetched using the `getLogo` function.

This documentation provides an overview of the `Header` component, its usage, and the available props for customization. The component is designed to be responsive and adjusts its layout based on the user's role and screen size.