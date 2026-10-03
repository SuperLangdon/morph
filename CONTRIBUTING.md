# Contributing to Morph

Welcome to Morph! The following are guidelines for contribution. Use your best judgment, and feel free to propose changes to this document in an issue.

## Getting started

To contribute, you can start by taking a look at open issues under GitHub's 'Issues' tab. Feel free to assign yourself to any issue marked for contributors, and comment with questions or clarifications.

Before starting work on a PR, please **first discuss the change you wish to make via GitHub issue**, or any other method with the repository owners beforehand. This will give us the opportunity to provide feedback, and avoid wasted effort subsequently.

## Relationship to upstream Isomer

Morph tracks [opengovsg/isomer](https://github.com/opengovsg/isomer) upstream.
Before proposing a change that also exists upstream, check whether it is easier
to port the upstream commit — see [UPSTREAM.md](./UPSTREAM.md) for the sync
procedure and [MORPH.md](./MORPH.md) for the rules on which divergences are
intentional. Do not reintroduce Singapore-government-specific modules,
providers, domains or content; they were removed deliberately.

## Security reports

Please do not file an open issue for ongoing security bugs. Instead, contact
the maintainers directly with your findings (see the security policy on the
repository, or open a GitHub security advisory).

## Bug reports and feature requests

The following guidelines help maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before submitting bug reports or feature request, please check our issues and PRs first. You might find out that you don't need to create one.

When **submitting a bug report**, please include as many details as possible, such as the steps to reproduce this bug, expected and actual behaviour.

When **submitting a feature request**, please include the motivation, alternatives that you've considered and any additional contexts that could help us better understand your goal.

Here are some tips to writing good issues:

- **Use a clear and descriptive title** to identify the problem
- **Describe the exact steps to reproduce the problem** and **explain how you did it**
- **Provide specific examples to demonstrate the steps**
- **Include screenshots or animated GIFs if you can**
- **Explain why this new feature would be useful**

## Making a pull request

If you're submitting a pull request, some points to note:

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build. Refer to [README.md](./README.md) for more details
2. Update the [README.md](./README.md) with details of changes to the interface, including new environment variables, exposed ports, useful file locations and container parameters.
3. Write [semantic commit messages](https://www.conventionalcommits.org/en/v1.0.0/).
4. Scope each PR to a single concern so it stays individually reviewable and revertable. A stacked-PR tool (e.g. [Graphite](https://graphite.dev)) can help, but plain branches work just as well.
5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.
