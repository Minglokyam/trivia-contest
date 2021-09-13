import React from 'react';
import NavigationBar from './NavigationBar';

interface LayoutProps {
    userData: string;
}

const Layout: React.FC<LayoutProps>= ({children, ...props}) => {
    return (
        <div>
            <NavigationBar {...props} />
            {children}
        </div>
    );
};

export default Layout;