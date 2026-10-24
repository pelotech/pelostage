import {
  Link,
  sidebarConfig,
  useSidebarOpenState,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
  // same heights as the built-in logos
  logoFull: {
    width: 'auto',
    height: 30,
  },
  logoIcon: {
    width: 'auto',
    height: 28,
  },
});

export const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();
  const config = useApi(configApiRef);
  const logoFullUrl = config.getOptionalString('app.branding.logoFullUrl');
  const logoIconUrl = config.getOptionalString('app.branding.logoIconUrl');
  const title = config.getOptionalString('app.title') ?? 'Home';

  const fullLogo = logoFullUrl ? (
    <img src={logoFullUrl} alt={title} className={classes.logoFull} />
  ) : (
    <LogoFull />
  );
  const iconLogo = logoIconUrl ? (
    <img src={logoIconUrl} alt={title} className={classes.logoIcon} />
  ) : (
    <LogoIcon />
  );

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? fullLogo : iconLogo}
      </Link>
    </div>
  );
};
