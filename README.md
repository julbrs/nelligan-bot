# Nelligan-Bot

Facebook Messenger Bot that can handle operations around Nelligan Montreal
public libraries system. Allow to list books on multiple cards.

## Getting Started

### Development

```
npm install
npm run dev
```

I really recommand to use [serveo](https://serveo.net/) to allow facebook to be
able to communicate with your local computer during developement.
It will expose your local server on the internet temporally. Just run in a
command prompt:

```
ssh  -o ServerAliveInterval=60 -R 80:localhost:3000 serveo.net
```
And your local 3000 port will be exposed on a subdomain of serveo in HTTPS.

If you want to reuse always the same subdomain just do:

```
ssh  -o ServerAliveInterval=60 -R mysubdomain:80:localhost:8888 serveo.net
```

Then you can just provide ``mysubdomain.serveo.net`` as your ``hostname`` in
facebook configuration.


## Running the tests

No test yet. TODO

## Built With

* [Nelligan-api](https://github.com/bobman38/nelligan-api) - Nelligan API
* [Botkit](https://botkit.ai/) - A cool framework to build bot


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
