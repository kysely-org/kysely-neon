![A Kysely-branded yellow duck playing with bricks together with a Neon-branded elephant](./assets/banner.png)

[![NPM Version](https://img.shields.io/npm/v/kysely-neon?style=flat&label=latest)](https://github.com/kysely-org/kysely-neon/releases/latest)
[![Tests](https://github.com/kysely-org/kysely-neon/actions/workflows/test.yml/badge.svg)](https://github.com/kysely-org/kysely-neon)
[![License](https://img.shields.io/github/license/kysely-org/kysely-neon?style=flat)](https://github.com/kysely-org/kysely-neon/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues-closed/kysely-org/kysely-neon?logo=github)](https://github.com/kysely-org/kysely-neon/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc)
[![Pull Requests](https://img.shields.io/github/issues-pr-closed/kysely-org/kysely-neon?label=PRs&logo=github&style=flat)](https://github.com/kysely-org/kysely-neon/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc)
![GitHub contributors](https://img.shields.io/github/contributors/kysely-org/kysely-neon)
[![Downloads](https://img.shields.io/npm/dw/kysely-neon?logo=npm)](https://www.npmjs.com/package/kysely-neon)

###### Join the discussion ⠀⠀⠀⠀⠀⠀⠀

[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=flat&logo=discord&logoColor=white)](https://discord.gg/xyBJ3GwvAm)
[![Bluesky](https://img.shields.io/badge/Bluesky-0285FF?style=flat&logo=Bluesky&logoColor=white)](https://bsky.app/profile/kysely.dev)

`kysely-neon` offers a [Kysely](https://github.com/kysely-org/kysely) dialect for [Neon](https://neon.tech/)'s [serverless driver](https://neon.com/docs/serverless/serverless-driver#use-the-driver-over-http) over HTTP.

For WebSockets usage, you don't need this package. Use [Neon](https://neon.tech/)'s `Pool` instance with [Kysely](https://github.com/kysely-org/kysely)'s core [PostgreSQL dialect](https://kysely-org.github.io/kysely-apidoc/classes/PostgresDialect.html).

## Installation

### Node.js

```bash
npm install kysely-neon @neondatabase/serverless kysely
```

```bash
pnpm add kysely-neon @neondatabase/serverless kysely
```

```bash
yarn add kysely-neon @neondatabase/serverless kysely
```

### Other runtimes

```bash
deno add npm:kysely-neon npm:@neondatabase/serverless npm:kysely
```

```bash
bun add kysely-neon @neondatabase/serverless kysely
```

## Usage

```ts
import { neon } from "@neondatabase/serverless";
import { type GeneratedAlways, Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";

interface Database {
	person: {
		id: GeneratedAlways<number>;
		first_name: string | null;
		last_name: string | null;
		age: number;
	};
}

const db = new Kysely<Database>({
	dialect: new NeonDialect({
		neon: neon(process.env.CONNECTION_STRING!),
	}),
});

const people = await db.selectFrom("person").selectAll().execute();
```

## Acknowledgements

[seveibar](https://github.com/seveibar) who created and maintained this library. :heart:
