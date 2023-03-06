# AwsCdkWorkshop2023

# aws-infra

Lerna monorepo that manages AWS infrastructure and resource provisioning code (IaC)

## Prerequisites

Install AWS v2 CLI tool on OSX

> In the case you use a different operating system please check the reference https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

```
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

Check the installation succeed

```
which aws
/usr/local/bin/aws

aws --version
aws-cli/2.4.5 Python/3.8.8 Darwin/18.7.0 botocore/2.4.5
```

### Using both aws v1 and v2

Rename version 1 and install the new version

```bash
which aws
/usr/local/bin/aws

mv /usr/local/bin/aws /usr/local/bin/aws1

# then follow the steps of previous section
```


## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
