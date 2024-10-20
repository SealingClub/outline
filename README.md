<p align="center">
  <img src="https://user-images.githubusercontent.com/31465/34380645-bd67f474-eb0b-11e7-8d03-0151c1730654.png" height="29" />
</p>
<p align="center">
  <i>A fast, collaborative, knowledge base for your team built using React and Node.js.<br/>Try out Outline using our hosted version at <a href="https://www.getoutline.com">www.getoutline.com</a>.</i>
  <br/>
</p>
<p align="center">
  <a href="https://circleci.com/gh/outline/outline" rel="nofollow"><img src="https://circleci.com/gh/outline/outline.svg?style=shield"></a>
  <a href="http://www.typescriptlang.org" rel="nofollow"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" alt="TypeScript"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat" alt="Prettier"></a>
  <a href="https://github.com/styled-components/styled-components"><img src="https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg" alt="Styled Components"></a>
  <a href="https://translate.getoutline.com/project/outline" alt="Localized"><img src="https://badges.crowdin.net/outline/localized.svg"></a>
</p>

This is the source code that runs [**Outline**](https://www.getoutline.com) and all the associated services. If you want to use Outline then you don't need to run this code, we offer a hosted version of the app at [getoutline.com](https://www.getoutline.com). You can also find documentation on using Outline in [our guide](https://docs.getoutline.com/s/guide).

If you'd like to run your own copy of Outline or contribute to development then this is the place for you.

# Installation

Please see the [documentation](https://docs.getoutline.com/s/hosting/) for running your own copy of Outline in a production configuration.

If you have questions or improvements for the docs please create a thread in [GitHub discussions](https://github.com/outline/outline/discussions).

# Development

There is a short guide for [setting up a development environment](https://docs.getoutline.com/s/hosting/doc/local-development-5hEhFRXow7) if you wish to contribute changes, fixes, and improvements to Outline.

## For windows

查文档发现这东西不支持在windows上直接开发（悲），但是我们在Windows下还是有最好用的linux开放环境——wsl的（逃

### 依赖

* wsl
* docker for desktop
* nodejs （在wsl中）
* yarn （在wsl中）

首先打开wsl（这个东西应该在你安装docker的时候默认就安装了），你最好搞个发行版的wsl（可以在Microsoft商店获取，这是这个应用商店为数不多好用的时候

进入wsl，按照nodejs

然后使用

```shell
corepack enable
```
就可以开启yarn了

### 开发环境

建议使用vscode之类的东西连接wsl

首先clone一下

```shell
git clone git@sealclub.wiki:WannaR/outline4sealclub.git
```

然后运行

```shell
cd outline4sealclub
cp .env.sample .env
```

这个时候需要对`.env`文件进行一些配置。需要修改的配置如下

```shell
NODE_ENV=development

SECRET_KEY=`openssl rand -hex 32`
UTILS_SECRET=`openssl rand -hex 32`
```
改好之后运行

```shell
make up
```

就可以开始了开发了，so easy，如果你使用vscode之类的玩意，应该已经自动做了端口转发，否则你可能还需要改配置文件中的`URL`
如果make up报错` - IFRAMELY_URL 不能为空`之类的东西，就去env文件里面把报错项注释掉就好

此时使用

```shell
node build/server/scripts/seed.js example@mail.com
```

可以生成一个临时的访问账户，无需配置oidc等登录服务。
其余内容参看[setting up a development environment](https://docs.getoutline.com/s/hosting/doc/local-development-5hEhFRXow7)(其实没什么好看的)

## Contributing

Outline is built and maintained by a small team – we'd love your help to fix bugs and add features!

Before submitting a pull request _please_ discuss with the core team by creating or commenting in an issue on [GitHub](https://www.github.com/outline/outline/issues) – we'd also love to hear from you in the [discussions](https://www.github.com/outline/outline/discussions). This way we can ensure that an approach is agreed on before code is written. This will result in a much higher likelihood of your code being accepted.

If you’re looking for ways to get started, here's a list of ways to help us improve Outline:

- [Translation](docs/TRANSLATION.md) into other languages
- Issues with [`good first issue`](https://github.com/outline/outline/labels/good%20first%20issue) label
- Performance improvements, both on server and frontend
- Developer happiness and documentation
- Bugs and other issues listed on GitHub

## Architecture

If you're interested in contributing or learning more about the Outline codebase
please refer to the [architecture document](docs/ARCHITECTURE.md) first for a high level overview of how the application is put together.

## Debugging

In development Outline outputs simple logging to the console, prefixed by categories. In production it outputs JSON logs, these can be easily parsed by your preferred log ingestion pipeline.

HTTP logging is disabled by default, but can be enabled by setting the `DEBUG=http` environment variable.

## Tests

We aim to have sufficient test coverage for critical parts of the application and aren't aiming for 100% unit test coverage. All API endpoints and anything authentication related should be thoroughly tested.

To add new tests, write your tests with [Jest](https://facebook.github.io/jest/) and add a file with `.test.js` extension next to the tested code.

```shell
# To run all tests
make test

# To run backend tests in watch mode
make watch
```

Once the test database is created with `make test` you may individually run
frontend and backend tests directly.

```shell
# To run backend tests
yarn test:server

# To run a specific backend test
yarn test:server myTestFile

# To run frontend tests
yarn test:app
```

## Migrations

Sequelize is used to create and run migrations, for example:

```shell
yarn sequelize migration:generate --name my-migration
yarn sequelize db:migrate
```

Or to run migrations on test database:

```shell
yarn sequelize db:migrate --env test
```

# Activity

![Alt](https://repobeats.axiom.co/api/embed/ff2e4e6918afff1acf9deb72d1ba6b071d586178.svg "Repobeats analytics image")

# License

Outline is [BSL 1.1 licensed](LICENSE).
