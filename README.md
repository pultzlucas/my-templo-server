# My templo server
This is a templo server containing all my public templates available to use and do not requires access key.

## Tecnologies used
- **Deno** for typescript runtime.
- **Oak** for HTTP middleware framework.
- **Heroku** for deployment.

## Api entry point
https://pultzlucas-templo-server.herokuapp.com

## Usage

Route | Description |
-----------|--------|
/templates  | returns all templates
/templates/&lt;template-name&gt; | returns a specific template
