import { SignInPage as CoreSignInPage } from '@backstage/core-components';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';

export const SignInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props =>
      (
        <CoreSignInPage
          {...props}
          auto
          provider={{
            id: 'github-auth-provider',
            title: 'GitHub',
            message: 'Sign in using GitHub',
            apiRef: githubAuthApiRef,
          }}
        />
      ),
  },
});
