# GraduateNU API V2

## Running the API

1. Run `yarn dev:db:up` from the project root to run the database in docker. You can run `yarn dev:db:down` from the project root to take down the database when you're done.

2. Run `yarn dev` from within the api-v2 directory to run the server in watch mode.

## Testing

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:db:up
$ yarn test:e2e
$ yarn test:db:down

# test coverage
$ yarn test:cov
```

## Making Entity Changes

1. If you make an entity(db) change, you will need to generate new migrations and then run those migrations locally to alter your database schemas. You can do so as follows:

- Make the change to the .entity.ts file
- Run `yarn dev:migration:generate - "<NameOfTheChange>"`. This will generate a new migration file that describes the change to the db schema(s). You will loose all local data when running this command.
- Run `yarn dev:migration:run` to run the newly generated migration.

2. Each migration should have a cohesive set of changes to our entities. If you have unrelated db changes then please generate multiple migrations. A good rule of thumb: if you find it hard to name your migration then you probably need to split it.

## Design Decisions

A running log of design decisions that were taken. These can and will probably change as the server scales.

- If you want to change the way things work, start a discussion, make the change and document it here!

- If you're making changes to the codebase, please ensure that your changes follow the design documented here!

### Error Handling

- Services will be HTTP agnostic and not throw HTTP errors.

- Services will not throw errors in general, and will return `null` for exceptional behavior. For instance, if a user with the same email already exists, return `null` and expect the controller to handle this. This isn't great since we loose the error that actually happened and so we probably want to implement more specific error handling than just returning `null` at the service level.

- Controllers will handle the case when services return `null` and throw appropriate HTTP errors.

### Logging

- Whenever returning null from a service to indicate an error, be sure to do a debug log indicating the specific reason for returning the null.

- Whenever introducing logging to a service, follow the pattern of creating a private `format[ServiceName]Ctx()` method to create the context string for the new service's logs. Use the method to supply the context string in all the service's logs.
