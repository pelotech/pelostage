import { screen } from '@testing-library/react';
import { SidebarOpenStateProvider } from '@backstage/core-components';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { SidebarLogo } from './SidebarLogo';

const renderLogo = (isOpen: boolean, branding?: Record<string, string>) =>
  renderInTestApp(
    <SidebarOpenStateProvider value={{ isOpen, setOpen: () => {} }}>
      <SidebarLogo />
    </SidebarOpenStateProvider>,
    { config: { app: { title: 'Acme portal', ...(branding && { branding }) } } },
  );

describe('SidebarLogo', () => {
  const branding = {
    logoFullUrl: 'https://example.com/full.svg',
    logoIconUrl: 'https://example.com/icon.svg',
  };

  it('uses the configured full logo when the sidebar is open', async () => {
    renderLogo(true, branding);
    const img = await screen.findByRole('img', { name: 'Acme portal' });
    expect(img).toHaveAttribute('src', branding.logoFullUrl);
  });

  it('uses the configured icon when the sidebar is closed', async () => {
    renderLogo(false, branding);
    const img = await screen.findByRole('img', { name: 'Acme portal' });
    expect(img).toHaveAttribute('src', branding.logoIconUrl);
  });

  it('falls back to the built-in logo without branding config', async () => {
    renderLogo(true);
    await screen.findByRole('link', { name: 'Home' });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
