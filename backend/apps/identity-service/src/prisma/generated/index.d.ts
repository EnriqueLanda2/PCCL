
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Privilege
 * 
 */
export type Privilege = $Result.DefaultSelection<Prisma.$PrivilegePayload>
/**
 * Model SystemModule
 * 
 */
export type SystemModule = $Result.DefaultSelection<Prisma.$SystemModulePayload>
/**
 * Model UserRole
 * 
 */
export type UserRole = $Result.DefaultSelection<Prisma.$UserRolePayload>
/**
 * Model RolePrivilege
 * 
 */
export type RolePrivilege = $Result.DefaultSelection<Prisma.$RolePrivilegePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.privilege`: Exposes CRUD operations for the **Privilege** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Privileges
    * const privileges = await prisma.privilege.findMany()
    * ```
    */
  get privilege(): Prisma.PrivilegeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemModule`: Exposes CRUD operations for the **SystemModule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemModules
    * const systemModules = await prisma.systemModule.findMany()
    * ```
    */
  get systemModule(): Prisma.SystemModuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userRole`: Exposes CRUD operations for the **UserRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserRoles
    * const userRoles = await prisma.userRole.findMany()
    * ```
    */
  get userRole(): Prisma.UserRoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rolePrivilege`: Exposes CRUD operations for the **RolePrivilege** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RolePrivileges
    * const rolePrivileges = await prisma.rolePrivilege.findMany()
    * ```
    */
  get rolePrivilege(): Prisma.RolePrivilegeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Role: 'Role',
    Privilege: 'Privilege',
    SystemModule: 'SystemModule',
    UserRole: 'UserRole',
    RolePrivilege: 'RolePrivilege'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "role" | "privilege" | "systemModule" | "userRole" | "rolePrivilege"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Privilege: {
        payload: Prisma.$PrivilegePayload<ExtArgs>
        fields: Prisma.PrivilegeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrivilegeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrivilegeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>
          }
          findFirst: {
            args: Prisma.PrivilegeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrivilegeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>
          }
          findMany: {
            args: Prisma.PrivilegeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>[]
          }
          create: {
            args: Prisma.PrivilegeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>
          }
          createMany: {
            args: Prisma.PrivilegeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrivilegeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>[]
          }
          delete: {
            args: Prisma.PrivilegeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>
          }
          update: {
            args: Prisma.PrivilegeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>
          }
          deleteMany: {
            args: Prisma.PrivilegeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrivilegeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PrivilegeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>[]
          }
          upsert: {
            args: Prisma.PrivilegeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivilegePayload>
          }
          aggregate: {
            args: Prisma.PrivilegeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrivilege>
          }
          groupBy: {
            args: Prisma.PrivilegeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrivilegeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrivilegeCountArgs<ExtArgs>
            result: $Utils.Optional<PrivilegeCountAggregateOutputType> | number
          }
        }
      }
      SystemModule: {
        payload: Prisma.$SystemModulePayload<ExtArgs>
        fields: Prisma.SystemModuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemModuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemModuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>
          }
          findFirst: {
            args: Prisma.SystemModuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemModuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>
          }
          findMany: {
            args: Prisma.SystemModuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>[]
          }
          create: {
            args: Prisma.SystemModuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>
          }
          createMany: {
            args: Prisma.SystemModuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemModuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>[]
          }
          delete: {
            args: Prisma.SystemModuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>
          }
          update: {
            args: Prisma.SystemModuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>
          }
          deleteMany: {
            args: Prisma.SystemModuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemModuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemModuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>[]
          }
          upsert: {
            args: Prisma.SystemModuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemModulePayload>
          }
          aggregate: {
            args: Prisma.SystemModuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemModule>
          }
          groupBy: {
            args: Prisma.SystemModuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemModuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemModuleCountArgs<ExtArgs>
            result: $Utils.Optional<SystemModuleCountAggregateOutputType> | number
          }
        }
      }
      UserRole: {
        payload: Prisma.$UserRolePayload<ExtArgs>
        fields: Prisma.UserRoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserRoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserRoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          findFirst: {
            args: Prisma.UserRoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserRoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          findMany: {
            args: Prisma.UserRoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          create: {
            args: Prisma.UserRoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          createMany: {
            args: Prisma.UserRoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserRoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          delete: {
            args: Prisma.UserRoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          update: {
            args: Prisma.UserRoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          deleteMany: {
            args: Prisma.UserRoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserRoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserRoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          upsert: {
            args: Prisma.UserRoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          aggregate: {
            args: Prisma.UserRoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserRole>
          }
          groupBy: {
            args: Prisma.UserRoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserRoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserRoleCountArgs<ExtArgs>
            result: $Utils.Optional<UserRoleCountAggregateOutputType> | number
          }
        }
      }
      RolePrivilege: {
        payload: Prisma.$RolePrivilegePayload<ExtArgs>
        fields: Prisma.RolePrivilegeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RolePrivilegeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RolePrivilegeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>
          }
          findFirst: {
            args: Prisma.RolePrivilegeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RolePrivilegeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>
          }
          findMany: {
            args: Prisma.RolePrivilegeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>[]
          }
          create: {
            args: Prisma.RolePrivilegeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>
          }
          createMany: {
            args: Prisma.RolePrivilegeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RolePrivilegeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>[]
          }
          delete: {
            args: Prisma.RolePrivilegeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>
          }
          update: {
            args: Prisma.RolePrivilegeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>
          }
          deleteMany: {
            args: Prisma.RolePrivilegeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RolePrivilegeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RolePrivilegeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>[]
          }
          upsert: {
            args: Prisma.RolePrivilegeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePrivilegePayload>
          }
          aggregate: {
            args: Prisma.RolePrivilegeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRolePrivilege>
          }
          groupBy: {
            args: Prisma.RolePrivilegeGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolePrivilegeGroupByOutputType>[]
          }
          count: {
            args: Prisma.RolePrivilegeCountArgs<ExtArgs>
            result: $Utils.Optional<RolePrivilegeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    role?: RoleOmit
    privilege?: PrivilegeOmit
    systemModule?: SystemModuleOmit
    userRole?: UserRoleOmit
    rolePrivilege?: RolePrivilegeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    userRoles: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRoles?: boolean | UserCountOutputTypeCountUserRolesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    rolePrivileges: number
    userRoles: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePrivileges?: boolean | RoleCountOutputTypeCountRolePrivilegesArgs
    userRoles?: boolean | RoleCountOutputTypeCountUserRolesArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountRolePrivilegesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePrivilegeWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUserRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
  }


  /**
   * Count Type PrivilegeCountOutputType
   */

  export type PrivilegeCountOutputType = {
    rolePrivileges: number
  }

  export type PrivilegeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePrivileges?: boolean | PrivilegeCountOutputTypeCountRolePrivilegesArgs
  }

  // Custom InputTypes
  /**
   * PrivilegeCountOutputType without action
   */
  export type PrivilegeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivilegeCountOutputType
     */
    select?: PrivilegeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PrivilegeCountOutputType without action
   */
  export type PrivilegeCountOutputTypeCountRolePrivilegesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePrivilegeWhereInput
  }


  /**
   * Count Type SystemModuleCountOutputType
   */

  export type SystemModuleCountOutputType = {
    privileges: number
  }

  export type SystemModuleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    privileges?: boolean | SystemModuleCountOutputTypeCountPrivilegesArgs
  }

  // Custom InputTypes
  /**
   * SystemModuleCountOutputType without action
   */
  export type SystemModuleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModuleCountOutputType
     */
    select?: SystemModuleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SystemModuleCountOutputType without action
   */
  export type SystemModuleCountOutputTypeCountPrivilegesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrivilegeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    active: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    active: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    fullName: number
    email: number
    passwordHash: number
    active: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    fullName?: true
    email?: true
    passwordHash?: true
    active?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    fullName?: true
    email?: true
    passwordHash?: true
    active?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    fullName?: true
    email?: true
    passwordHash?: true
    active?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    fullName: string
    email: string
    passwordHash: string
    active: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    active?: boolean
    userRoles?: boolean | User$userRolesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    active?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    active?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    active?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "fullName" | "email" | "passwordHash" | "active", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userRoles?: boolean | User$userRolesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      userRoles: Prisma.$UserRolePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionDate: Date
      startDate: Date | null
      endDate: Date | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
      fullName: string
      email: string
      passwordHash: string
      active: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userRoles<T extends User$userRolesArgs<ExtArgs> = {}>(args?: Subset<T, User$userRolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly transactionDate: FieldRef<"User", 'DateTime'>
    readonly startDate: FieldRef<"User", 'DateTime'>
    readonly endDate: FieldRef<"User", 'DateTime'>
    readonly createdBy: FieldRef<"User", 'String'>
    readonly updatedBy: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly active: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.userRoles
   */
  export type User$userRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    cursor?: UserRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    active: boolean | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    active: boolean | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    name: number
    active: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    active?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    active?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    active?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    name: string
    active: boolean
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    active?: boolean
    rolePrivileges?: boolean | Role$rolePrivilegesArgs<ExtArgs>
    userRoles?: boolean | Role$userRolesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    active?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    active?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    active?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "name" | "active", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePrivileges?: boolean | Role$rolePrivilegesArgs<ExtArgs>
    userRoles?: boolean | Role$userRolesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      rolePrivileges: Prisma.$RolePrivilegePayload<ExtArgs>[]
      userRoles: Prisma.$UserRolePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionDate: Date
      startDate: Date | null
      endDate: Date | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
      name: string
      active: boolean
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rolePrivileges<T extends Role$rolePrivilegesArgs<ExtArgs> = {}>(args?: Subset<T, Role$rolePrivilegesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userRoles<T extends Role$userRolesArgs<ExtArgs> = {}>(args?: Subset<T, Role$userRolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly transactionDate: FieldRef<"Role", 'DateTime'>
    readonly startDate: FieldRef<"Role", 'DateTime'>
    readonly endDate: FieldRef<"Role", 'DateTime'>
    readonly createdBy: FieldRef<"Role", 'String'>
    readonly updatedBy: FieldRef<"Role", 'String'>
    readonly createdAt: FieldRef<"Role", 'DateTime'>
    readonly updatedAt: FieldRef<"Role", 'DateTime'>
    readonly name: FieldRef<"Role", 'String'>
    readonly active: FieldRef<"Role", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.rolePrivileges
   */
  export type Role$rolePrivilegesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    where?: RolePrivilegeWhereInput
    orderBy?: RolePrivilegeOrderByWithRelationInput | RolePrivilegeOrderByWithRelationInput[]
    cursor?: RolePrivilegeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePrivilegeScalarFieldEnum | RolePrivilegeScalarFieldEnum[]
  }

  /**
   * Role.userRoles
   */
  export type Role$userRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    cursor?: UserRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Privilege
   */

  export type AggregatePrivilege = {
    _count: PrivilegeCountAggregateOutputType | null
    _min: PrivilegeMinAggregateOutputType | null
    _max: PrivilegeMaxAggregateOutputType | null
  }

  export type PrivilegeMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    code: string | null
    action: string | null
    moduleId: string | null
  }

  export type PrivilegeMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    code: string | null
    action: string | null
    moduleId: string | null
  }

  export type PrivilegeCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    code: number
    action: number
    moduleId: number
    _all: number
  }


  export type PrivilegeMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    code?: true
    action?: true
    moduleId?: true
  }

  export type PrivilegeMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    code?: true
    action?: true
    moduleId?: true
  }

  export type PrivilegeCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    code?: true
    action?: true
    moduleId?: true
    _all?: true
  }

  export type PrivilegeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Privilege to aggregate.
     */
    where?: PrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Privileges to fetch.
     */
    orderBy?: PrivilegeOrderByWithRelationInput | PrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Privileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Privileges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Privileges
    **/
    _count?: true | PrivilegeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrivilegeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrivilegeMaxAggregateInputType
  }

  export type GetPrivilegeAggregateType<T extends PrivilegeAggregateArgs> = {
        [P in keyof T & keyof AggregatePrivilege]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrivilege[P]>
      : GetScalarType<T[P], AggregatePrivilege[P]>
  }




  export type PrivilegeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrivilegeWhereInput
    orderBy?: PrivilegeOrderByWithAggregationInput | PrivilegeOrderByWithAggregationInput[]
    by: PrivilegeScalarFieldEnum[] | PrivilegeScalarFieldEnum
    having?: PrivilegeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrivilegeCountAggregateInputType | true
    _min?: PrivilegeMinAggregateInputType
    _max?: PrivilegeMaxAggregateInputType
  }

  export type PrivilegeGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    code: string
    action: string
    moduleId: string
    _count: PrivilegeCountAggregateOutputType | null
    _min: PrivilegeMinAggregateOutputType | null
    _max: PrivilegeMaxAggregateOutputType | null
  }

  type GetPrivilegeGroupByPayload<T extends PrivilegeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrivilegeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrivilegeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrivilegeGroupByOutputType[P]>
            : GetScalarType<T[P], PrivilegeGroupByOutputType[P]>
        }
      >
    >


  export type PrivilegeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    action?: boolean
    moduleId?: boolean
    module?: boolean | SystemModuleDefaultArgs<ExtArgs>
    rolePrivileges?: boolean | Privilege$rolePrivilegesArgs<ExtArgs>
    _count?: boolean | PrivilegeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["privilege"]>

  export type PrivilegeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    action?: boolean
    moduleId?: boolean
    module?: boolean | SystemModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["privilege"]>

  export type PrivilegeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    action?: boolean
    moduleId?: boolean
    module?: boolean | SystemModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["privilege"]>

  export type PrivilegeSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    action?: boolean
    moduleId?: boolean
  }

  export type PrivilegeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "code" | "action" | "moduleId", ExtArgs["result"]["privilege"]>
  export type PrivilegeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | SystemModuleDefaultArgs<ExtArgs>
    rolePrivileges?: boolean | Privilege$rolePrivilegesArgs<ExtArgs>
    _count?: boolean | PrivilegeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PrivilegeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | SystemModuleDefaultArgs<ExtArgs>
  }
  export type PrivilegeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | SystemModuleDefaultArgs<ExtArgs>
  }

  export type $PrivilegePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Privilege"
    objects: {
      module: Prisma.$SystemModulePayload<ExtArgs>
      rolePrivileges: Prisma.$RolePrivilegePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionDate: Date
      startDate: Date | null
      endDate: Date | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
      code: string
      action: string
      moduleId: string
    }, ExtArgs["result"]["privilege"]>
    composites: {}
  }

  type PrivilegeGetPayload<S extends boolean | null | undefined | PrivilegeDefaultArgs> = $Result.GetResult<Prisma.$PrivilegePayload, S>

  type PrivilegeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PrivilegeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrivilegeCountAggregateInputType | true
    }

  export interface PrivilegeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Privilege'], meta: { name: 'Privilege' } }
    /**
     * Find zero or one Privilege that matches the filter.
     * @param {PrivilegeFindUniqueArgs} args - Arguments to find a Privilege
     * @example
     * // Get one Privilege
     * const privilege = await prisma.privilege.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrivilegeFindUniqueArgs>(args: SelectSubset<T, PrivilegeFindUniqueArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Privilege that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PrivilegeFindUniqueOrThrowArgs} args - Arguments to find a Privilege
     * @example
     * // Get one Privilege
     * const privilege = await prisma.privilege.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrivilegeFindUniqueOrThrowArgs>(args: SelectSubset<T, PrivilegeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Privilege that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivilegeFindFirstArgs} args - Arguments to find a Privilege
     * @example
     * // Get one Privilege
     * const privilege = await prisma.privilege.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrivilegeFindFirstArgs>(args?: SelectSubset<T, PrivilegeFindFirstArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Privilege that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivilegeFindFirstOrThrowArgs} args - Arguments to find a Privilege
     * @example
     * // Get one Privilege
     * const privilege = await prisma.privilege.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrivilegeFindFirstOrThrowArgs>(args?: SelectSubset<T, PrivilegeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Privileges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivilegeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Privileges
     * const privileges = await prisma.privilege.findMany()
     * 
     * // Get first 10 Privileges
     * const privileges = await prisma.privilege.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const privilegeWithIdOnly = await prisma.privilege.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PrivilegeFindManyArgs>(args?: SelectSubset<T, PrivilegeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Privilege.
     * @param {PrivilegeCreateArgs} args - Arguments to create a Privilege.
     * @example
     * // Create one Privilege
     * const Privilege = await prisma.privilege.create({
     *   data: {
     *     // ... data to create a Privilege
     *   }
     * })
     * 
     */
    create<T extends PrivilegeCreateArgs>(args: SelectSubset<T, PrivilegeCreateArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Privileges.
     * @param {PrivilegeCreateManyArgs} args - Arguments to create many Privileges.
     * @example
     * // Create many Privileges
     * const privilege = await prisma.privilege.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrivilegeCreateManyArgs>(args?: SelectSubset<T, PrivilegeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Privileges and returns the data saved in the database.
     * @param {PrivilegeCreateManyAndReturnArgs} args - Arguments to create many Privileges.
     * @example
     * // Create many Privileges
     * const privilege = await prisma.privilege.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Privileges and only return the `id`
     * const privilegeWithIdOnly = await prisma.privilege.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrivilegeCreateManyAndReturnArgs>(args?: SelectSubset<T, PrivilegeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Privilege.
     * @param {PrivilegeDeleteArgs} args - Arguments to delete one Privilege.
     * @example
     * // Delete one Privilege
     * const Privilege = await prisma.privilege.delete({
     *   where: {
     *     // ... filter to delete one Privilege
     *   }
     * })
     * 
     */
    delete<T extends PrivilegeDeleteArgs>(args: SelectSubset<T, PrivilegeDeleteArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Privilege.
     * @param {PrivilegeUpdateArgs} args - Arguments to update one Privilege.
     * @example
     * // Update one Privilege
     * const privilege = await prisma.privilege.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrivilegeUpdateArgs>(args: SelectSubset<T, PrivilegeUpdateArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Privileges.
     * @param {PrivilegeDeleteManyArgs} args - Arguments to filter Privileges to delete.
     * @example
     * // Delete a few Privileges
     * const { count } = await prisma.privilege.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrivilegeDeleteManyArgs>(args?: SelectSubset<T, PrivilegeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Privileges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivilegeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Privileges
     * const privilege = await prisma.privilege.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrivilegeUpdateManyArgs>(args: SelectSubset<T, PrivilegeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Privileges and returns the data updated in the database.
     * @param {PrivilegeUpdateManyAndReturnArgs} args - Arguments to update many Privileges.
     * @example
     * // Update many Privileges
     * const privilege = await prisma.privilege.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Privileges and only return the `id`
     * const privilegeWithIdOnly = await prisma.privilege.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PrivilegeUpdateManyAndReturnArgs>(args: SelectSubset<T, PrivilegeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Privilege.
     * @param {PrivilegeUpsertArgs} args - Arguments to update or create a Privilege.
     * @example
     * // Update or create a Privilege
     * const privilege = await prisma.privilege.upsert({
     *   create: {
     *     // ... data to create a Privilege
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Privilege we want to update
     *   }
     * })
     */
    upsert<T extends PrivilegeUpsertArgs>(args: SelectSubset<T, PrivilegeUpsertArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Privileges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivilegeCountArgs} args - Arguments to filter Privileges to count.
     * @example
     * // Count the number of Privileges
     * const count = await prisma.privilege.count({
     *   where: {
     *     // ... the filter for the Privileges we want to count
     *   }
     * })
    **/
    count<T extends PrivilegeCountArgs>(
      args?: Subset<T, PrivilegeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrivilegeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Privilege.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivilegeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrivilegeAggregateArgs>(args: Subset<T, PrivilegeAggregateArgs>): Prisma.PrismaPromise<GetPrivilegeAggregateType<T>>

    /**
     * Group by Privilege.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivilegeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PrivilegeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrivilegeGroupByArgs['orderBy'] }
        : { orderBy?: PrivilegeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PrivilegeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrivilegeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Privilege model
   */
  readonly fields: PrivilegeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Privilege.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrivilegeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    module<T extends SystemModuleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SystemModuleDefaultArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    rolePrivileges<T extends Privilege$rolePrivilegesArgs<ExtArgs> = {}>(args?: Subset<T, Privilege$rolePrivilegesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Privilege model
   */
  interface PrivilegeFieldRefs {
    readonly id: FieldRef<"Privilege", 'String'>
    readonly transactionDate: FieldRef<"Privilege", 'DateTime'>
    readonly startDate: FieldRef<"Privilege", 'DateTime'>
    readonly endDate: FieldRef<"Privilege", 'DateTime'>
    readonly createdBy: FieldRef<"Privilege", 'String'>
    readonly updatedBy: FieldRef<"Privilege", 'String'>
    readonly createdAt: FieldRef<"Privilege", 'DateTime'>
    readonly updatedAt: FieldRef<"Privilege", 'DateTime'>
    readonly code: FieldRef<"Privilege", 'String'>
    readonly action: FieldRef<"Privilege", 'String'>
    readonly moduleId: FieldRef<"Privilege", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Privilege findUnique
   */
  export type PrivilegeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which Privilege to fetch.
     */
    where: PrivilegeWhereUniqueInput
  }

  /**
   * Privilege findUniqueOrThrow
   */
  export type PrivilegeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which Privilege to fetch.
     */
    where: PrivilegeWhereUniqueInput
  }

  /**
   * Privilege findFirst
   */
  export type PrivilegeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which Privilege to fetch.
     */
    where?: PrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Privileges to fetch.
     */
    orderBy?: PrivilegeOrderByWithRelationInput | PrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Privileges.
     */
    cursor?: PrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Privileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Privileges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Privileges.
     */
    distinct?: PrivilegeScalarFieldEnum | PrivilegeScalarFieldEnum[]
  }

  /**
   * Privilege findFirstOrThrow
   */
  export type PrivilegeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which Privilege to fetch.
     */
    where?: PrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Privileges to fetch.
     */
    orderBy?: PrivilegeOrderByWithRelationInput | PrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Privileges.
     */
    cursor?: PrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Privileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Privileges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Privileges.
     */
    distinct?: PrivilegeScalarFieldEnum | PrivilegeScalarFieldEnum[]
  }

  /**
   * Privilege findMany
   */
  export type PrivilegeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which Privileges to fetch.
     */
    where?: PrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Privileges to fetch.
     */
    orderBy?: PrivilegeOrderByWithRelationInput | PrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Privileges.
     */
    cursor?: PrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Privileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Privileges.
     */
    skip?: number
    distinct?: PrivilegeScalarFieldEnum | PrivilegeScalarFieldEnum[]
  }

  /**
   * Privilege create
   */
  export type PrivilegeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * The data needed to create a Privilege.
     */
    data: XOR<PrivilegeCreateInput, PrivilegeUncheckedCreateInput>
  }

  /**
   * Privilege createMany
   */
  export type PrivilegeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Privileges.
     */
    data: PrivilegeCreateManyInput | PrivilegeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Privilege createManyAndReturn
   */
  export type PrivilegeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * The data used to create many Privileges.
     */
    data: PrivilegeCreateManyInput | PrivilegeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Privilege update
   */
  export type PrivilegeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * The data needed to update a Privilege.
     */
    data: XOR<PrivilegeUpdateInput, PrivilegeUncheckedUpdateInput>
    /**
     * Choose, which Privilege to update.
     */
    where: PrivilegeWhereUniqueInput
  }

  /**
   * Privilege updateMany
   */
  export type PrivilegeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Privileges.
     */
    data: XOR<PrivilegeUpdateManyMutationInput, PrivilegeUncheckedUpdateManyInput>
    /**
     * Filter which Privileges to update
     */
    where?: PrivilegeWhereInput
    /**
     * Limit how many Privileges to update.
     */
    limit?: number
  }

  /**
   * Privilege updateManyAndReturn
   */
  export type PrivilegeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * The data used to update Privileges.
     */
    data: XOR<PrivilegeUpdateManyMutationInput, PrivilegeUncheckedUpdateManyInput>
    /**
     * Filter which Privileges to update
     */
    where?: PrivilegeWhereInput
    /**
     * Limit how many Privileges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Privilege upsert
   */
  export type PrivilegeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * The filter to search for the Privilege to update in case it exists.
     */
    where: PrivilegeWhereUniqueInput
    /**
     * In case the Privilege found by the `where` argument doesn't exist, create a new Privilege with this data.
     */
    create: XOR<PrivilegeCreateInput, PrivilegeUncheckedCreateInput>
    /**
     * In case the Privilege was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrivilegeUpdateInput, PrivilegeUncheckedUpdateInput>
  }

  /**
   * Privilege delete
   */
  export type PrivilegeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    /**
     * Filter which Privilege to delete.
     */
    where: PrivilegeWhereUniqueInput
  }

  /**
   * Privilege deleteMany
   */
  export type PrivilegeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Privileges to delete
     */
    where?: PrivilegeWhereInput
    /**
     * Limit how many Privileges to delete.
     */
    limit?: number
  }

  /**
   * Privilege.rolePrivileges
   */
  export type Privilege$rolePrivilegesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    where?: RolePrivilegeWhereInput
    orderBy?: RolePrivilegeOrderByWithRelationInput | RolePrivilegeOrderByWithRelationInput[]
    cursor?: RolePrivilegeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePrivilegeScalarFieldEnum | RolePrivilegeScalarFieldEnum[]
  }

  /**
   * Privilege without action
   */
  export type PrivilegeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
  }


  /**
   * Model SystemModule
   */

  export type AggregateSystemModule = {
    _count: SystemModuleCountAggregateOutputType | null
    _min: SystemModuleMinAggregateOutputType | null
    _max: SystemModuleMaxAggregateOutputType | null
  }

  export type SystemModuleMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    key: string | null
    name: string | null
  }

  export type SystemModuleMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    key: string | null
    name: string | null
  }

  export type SystemModuleCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    key: number
    name: number
    _all: number
  }


  export type SystemModuleMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    key?: true
    name?: true
  }

  export type SystemModuleMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    key?: true
    name?: true
  }

  export type SystemModuleCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    key?: true
    name?: true
    _all?: true
  }

  export type SystemModuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemModule to aggregate.
     */
    where?: SystemModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemModules to fetch.
     */
    orderBy?: SystemModuleOrderByWithRelationInput | SystemModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemModules
    **/
    _count?: true | SystemModuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemModuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemModuleMaxAggregateInputType
  }

  export type GetSystemModuleAggregateType<T extends SystemModuleAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemModule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemModule[P]>
      : GetScalarType<T[P], AggregateSystemModule[P]>
  }




  export type SystemModuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemModuleWhereInput
    orderBy?: SystemModuleOrderByWithAggregationInput | SystemModuleOrderByWithAggregationInput[]
    by: SystemModuleScalarFieldEnum[] | SystemModuleScalarFieldEnum
    having?: SystemModuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemModuleCountAggregateInputType | true
    _min?: SystemModuleMinAggregateInputType
    _max?: SystemModuleMaxAggregateInputType
  }

  export type SystemModuleGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    key: string
    name: string
    _count: SystemModuleCountAggregateOutputType | null
    _min: SystemModuleMinAggregateOutputType | null
    _max: SystemModuleMaxAggregateOutputType | null
  }

  type GetSystemModuleGroupByPayload<T extends SystemModuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemModuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemModuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemModuleGroupByOutputType[P]>
            : GetScalarType<T[P], SystemModuleGroupByOutputType[P]>
        }
      >
    >


  export type SystemModuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    key?: boolean
    name?: boolean
    privileges?: boolean | SystemModule$privilegesArgs<ExtArgs>
    _count?: boolean | SystemModuleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["systemModule"]>

  export type SystemModuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    key?: boolean
    name?: boolean
  }, ExtArgs["result"]["systemModule"]>

  export type SystemModuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    key?: boolean
    name?: boolean
  }, ExtArgs["result"]["systemModule"]>

  export type SystemModuleSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    key?: boolean
    name?: boolean
  }

  export type SystemModuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "key" | "name", ExtArgs["result"]["systemModule"]>
  export type SystemModuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    privileges?: boolean | SystemModule$privilegesArgs<ExtArgs>
    _count?: boolean | SystemModuleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SystemModuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SystemModuleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SystemModulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemModule"
    objects: {
      privileges: Prisma.$PrivilegePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionDate: Date
      startDate: Date | null
      endDate: Date | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
      key: string
      name: string
    }, ExtArgs["result"]["systemModule"]>
    composites: {}
  }

  type SystemModuleGetPayload<S extends boolean | null | undefined | SystemModuleDefaultArgs> = $Result.GetResult<Prisma.$SystemModulePayload, S>

  type SystemModuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemModuleCountAggregateInputType | true
    }

  export interface SystemModuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemModule'], meta: { name: 'SystemModule' } }
    /**
     * Find zero or one SystemModule that matches the filter.
     * @param {SystemModuleFindUniqueArgs} args - Arguments to find a SystemModule
     * @example
     * // Get one SystemModule
     * const systemModule = await prisma.systemModule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemModuleFindUniqueArgs>(args: SelectSubset<T, SystemModuleFindUniqueArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemModule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemModuleFindUniqueOrThrowArgs} args - Arguments to find a SystemModule
     * @example
     * // Get one SystemModule
     * const systemModule = await prisma.systemModule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemModuleFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemModule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemModuleFindFirstArgs} args - Arguments to find a SystemModule
     * @example
     * // Get one SystemModule
     * const systemModule = await prisma.systemModule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemModuleFindFirstArgs>(args?: SelectSubset<T, SystemModuleFindFirstArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemModule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemModuleFindFirstOrThrowArgs} args - Arguments to find a SystemModule
     * @example
     * // Get one SystemModule
     * const systemModule = await prisma.systemModule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemModuleFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemModules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemModuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemModules
     * const systemModules = await prisma.systemModule.findMany()
     * 
     * // Get first 10 SystemModules
     * const systemModules = await prisma.systemModule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemModuleWithIdOnly = await prisma.systemModule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemModuleFindManyArgs>(args?: SelectSubset<T, SystemModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemModule.
     * @param {SystemModuleCreateArgs} args - Arguments to create a SystemModule.
     * @example
     * // Create one SystemModule
     * const SystemModule = await prisma.systemModule.create({
     *   data: {
     *     // ... data to create a SystemModule
     *   }
     * })
     * 
     */
    create<T extends SystemModuleCreateArgs>(args: SelectSubset<T, SystemModuleCreateArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemModules.
     * @param {SystemModuleCreateManyArgs} args - Arguments to create many SystemModules.
     * @example
     * // Create many SystemModules
     * const systemModule = await prisma.systemModule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemModuleCreateManyArgs>(args?: SelectSubset<T, SystemModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemModules and returns the data saved in the database.
     * @param {SystemModuleCreateManyAndReturnArgs} args - Arguments to create many SystemModules.
     * @example
     * // Create many SystemModules
     * const systemModule = await prisma.systemModule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemModules and only return the `id`
     * const systemModuleWithIdOnly = await prisma.systemModule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemModuleCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemModuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemModule.
     * @param {SystemModuleDeleteArgs} args - Arguments to delete one SystemModule.
     * @example
     * // Delete one SystemModule
     * const SystemModule = await prisma.systemModule.delete({
     *   where: {
     *     // ... filter to delete one SystemModule
     *   }
     * })
     * 
     */
    delete<T extends SystemModuleDeleteArgs>(args: SelectSubset<T, SystemModuleDeleteArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemModule.
     * @param {SystemModuleUpdateArgs} args - Arguments to update one SystemModule.
     * @example
     * // Update one SystemModule
     * const systemModule = await prisma.systemModule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemModuleUpdateArgs>(args: SelectSubset<T, SystemModuleUpdateArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemModules.
     * @param {SystemModuleDeleteManyArgs} args - Arguments to filter SystemModules to delete.
     * @example
     * // Delete a few SystemModules
     * const { count } = await prisma.systemModule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemModuleDeleteManyArgs>(args?: SelectSubset<T, SystemModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemModules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemModuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemModules
     * const systemModule = await prisma.systemModule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemModuleUpdateManyArgs>(args: SelectSubset<T, SystemModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemModules and returns the data updated in the database.
     * @param {SystemModuleUpdateManyAndReturnArgs} args - Arguments to update many SystemModules.
     * @example
     * // Update many SystemModules
     * const systemModule = await prisma.systemModule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemModules and only return the `id`
     * const systemModuleWithIdOnly = await prisma.systemModule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemModuleUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemModuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemModule.
     * @param {SystemModuleUpsertArgs} args - Arguments to update or create a SystemModule.
     * @example
     * // Update or create a SystemModule
     * const systemModule = await prisma.systemModule.upsert({
     *   create: {
     *     // ... data to create a SystemModule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemModule we want to update
     *   }
     * })
     */
    upsert<T extends SystemModuleUpsertArgs>(args: SelectSubset<T, SystemModuleUpsertArgs<ExtArgs>>): Prisma__SystemModuleClient<$Result.GetResult<Prisma.$SystemModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemModules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemModuleCountArgs} args - Arguments to filter SystemModules to count.
     * @example
     * // Count the number of SystemModules
     * const count = await prisma.systemModule.count({
     *   where: {
     *     // ... the filter for the SystemModules we want to count
     *   }
     * })
    **/
    count<T extends SystemModuleCountArgs>(
      args?: Subset<T, SystemModuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemModuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemModule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemModuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemModuleAggregateArgs>(args: Subset<T, SystemModuleAggregateArgs>): Prisma.PrismaPromise<GetSystemModuleAggregateType<T>>

    /**
     * Group by SystemModule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemModuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemModuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemModuleGroupByArgs['orderBy'] }
        : { orderBy?: SystemModuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemModule model
   */
  readonly fields: SystemModuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemModule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemModuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    privileges<T extends SystemModule$privilegesArgs<ExtArgs> = {}>(args?: Subset<T, SystemModule$privilegesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemModule model
   */
  interface SystemModuleFieldRefs {
    readonly id: FieldRef<"SystemModule", 'String'>
    readonly transactionDate: FieldRef<"SystemModule", 'DateTime'>
    readonly startDate: FieldRef<"SystemModule", 'DateTime'>
    readonly endDate: FieldRef<"SystemModule", 'DateTime'>
    readonly createdBy: FieldRef<"SystemModule", 'String'>
    readonly updatedBy: FieldRef<"SystemModule", 'String'>
    readonly createdAt: FieldRef<"SystemModule", 'DateTime'>
    readonly updatedAt: FieldRef<"SystemModule", 'DateTime'>
    readonly key: FieldRef<"SystemModule", 'String'>
    readonly name: FieldRef<"SystemModule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SystemModule findUnique
   */
  export type SystemModuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * Filter, which SystemModule to fetch.
     */
    where: SystemModuleWhereUniqueInput
  }

  /**
   * SystemModule findUniqueOrThrow
   */
  export type SystemModuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * Filter, which SystemModule to fetch.
     */
    where: SystemModuleWhereUniqueInput
  }

  /**
   * SystemModule findFirst
   */
  export type SystemModuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * Filter, which SystemModule to fetch.
     */
    where?: SystemModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemModules to fetch.
     */
    orderBy?: SystemModuleOrderByWithRelationInput | SystemModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemModules.
     */
    cursor?: SystemModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemModules.
     */
    distinct?: SystemModuleScalarFieldEnum | SystemModuleScalarFieldEnum[]
  }

  /**
   * SystemModule findFirstOrThrow
   */
  export type SystemModuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * Filter, which SystemModule to fetch.
     */
    where?: SystemModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemModules to fetch.
     */
    orderBy?: SystemModuleOrderByWithRelationInput | SystemModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemModules.
     */
    cursor?: SystemModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemModules.
     */
    distinct?: SystemModuleScalarFieldEnum | SystemModuleScalarFieldEnum[]
  }

  /**
   * SystemModule findMany
   */
  export type SystemModuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * Filter, which SystemModules to fetch.
     */
    where?: SystemModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemModules to fetch.
     */
    orderBy?: SystemModuleOrderByWithRelationInput | SystemModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemModules.
     */
    cursor?: SystemModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemModules.
     */
    skip?: number
    distinct?: SystemModuleScalarFieldEnum | SystemModuleScalarFieldEnum[]
  }

  /**
   * SystemModule create
   */
  export type SystemModuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * The data needed to create a SystemModule.
     */
    data: XOR<SystemModuleCreateInput, SystemModuleUncheckedCreateInput>
  }

  /**
   * SystemModule createMany
   */
  export type SystemModuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemModules.
     */
    data: SystemModuleCreateManyInput | SystemModuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemModule createManyAndReturn
   */
  export type SystemModuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * The data used to create many SystemModules.
     */
    data: SystemModuleCreateManyInput | SystemModuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemModule update
   */
  export type SystemModuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * The data needed to update a SystemModule.
     */
    data: XOR<SystemModuleUpdateInput, SystemModuleUncheckedUpdateInput>
    /**
     * Choose, which SystemModule to update.
     */
    where: SystemModuleWhereUniqueInput
  }

  /**
   * SystemModule updateMany
   */
  export type SystemModuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemModules.
     */
    data: XOR<SystemModuleUpdateManyMutationInput, SystemModuleUncheckedUpdateManyInput>
    /**
     * Filter which SystemModules to update
     */
    where?: SystemModuleWhereInput
    /**
     * Limit how many SystemModules to update.
     */
    limit?: number
  }

  /**
   * SystemModule updateManyAndReturn
   */
  export type SystemModuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * The data used to update SystemModules.
     */
    data: XOR<SystemModuleUpdateManyMutationInput, SystemModuleUncheckedUpdateManyInput>
    /**
     * Filter which SystemModules to update
     */
    where?: SystemModuleWhereInput
    /**
     * Limit how many SystemModules to update.
     */
    limit?: number
  }

  /**
   * SystemModule upsert
   */
  export type SystemModuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * The filter to search for the SystemModule to update in case it exists.
     */
    where: SystemModuleWhereUniqueInput
    /**
     * In case the SystemModule found by the `where` argument doesn't exist, create a new SystemModule with this data.
     */
    create: XOR<SystemModuleCreateInput, SystemModuleUncheckedCreateInput>
    /**
     * In case the SystemModule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemModuleUpdateInput, SystemModuleUncheckedUpdateInput>
  }

  /**
   * SystemModule delete
   */
  export type SystemModuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
    /**
     * Filter which SystemModule to delete.
     */
    where: SystemModuleWhereUniqueInput
  }

  /**
   * SystemModule deleteMany
   */
  export type SystemModuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemModules to delete
     */
    where?: SystemModuleWhereInput
    /**
     * Limit how many SystemModules to delete.
     */
    limit?: number
  }

  /**
   * SystemModule.privileges
   */
  export type SystemModule$privilegesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Privilege
     */
    select?: PrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Privilege
     */
    omit?: PrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivilegeInclude<ExtArgs> | null
    where?: PrivilegeWhereInput
    orderBy?: PrivilegeOrderByWithRelationInput | PrivilegeOrderByWithRelationInput[]
    cursor?: PrivilegeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PrivilegeScalarFieldEnum | PrivilegeScalarFieldEnum[]
  }

  /**
   * SystemModule without action
   */
  export type SystemModuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemModule
     */
    select?: SystemModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemModule
     */
    omit?: SystemModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemModuleInclude<ExtArgs> | null
  }


  /**
   * Model UserRole
   */

  export type AggregateUserRole = {
    _count: UserRoleCountAggregateOutputType | null
    _min: UserRoleMinAggregateOutputType | null
    _max: UserRoleMaxAggregateOutputType | null
  }

  export type UserRoleMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    roleId: string | null
  }

  export type UserRoleMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    roleId: string | null
  }

  export type UserRoleCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    userId: number
    roleId: number
    _all: number
  }


  export type UserRoleMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    roleId?: true
  }

  export type UserRoleMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    roleId?: true
  }

  export type UserRoleCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    roleId?: true
    _all?: true
  }

  export type UserRoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRole to aggregate.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserRoles
    **/
    _count?: true | UserRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserRoleMaxAggregateInputType
  }

  export type GetUserRoleAggregateType<T extends UserRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateUserRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserRole[P]>
      : GetScalarType<T[P], AggregateUserRole[P]>
  }




  export type UserRoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithAggregationInput | UserRoleOrderByWithAggregationInput[]
    by: UserRoleScalarFieldEnum[] | UserRoleScalarFieldEnum
    having?: UserRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserRoleCountAggregateInputType | true
    _min?: UserRoleMinAggregateInputType
    _max?: UserRoleMaxAggregateInputType
  }

  export type UserRoleGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    roleId: string
    _count: UserRoleCountAggregateOutputType | null
    _min: UserRoleMinAggregateOutputType | null
    _max: UserRoleMaxAggregateOutputType | null
  }

  type GetUserRoleGroupByPayload<T extends UserRoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserRoleGroupByOutputType[P]>
            : GetScalarType<T[P], UserRoleGroupByOutputType[P]>
        }
      >
    >


  export type UserRoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    roleId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    roleId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    roleId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    roleId?: boolean
  }

  export type UserRoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "userId" | "roleId", ExtArgs["result"]["userRole"]>
  export type UserRoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserRoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserRoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $UserRolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserRole"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionDate: Date
      startDate: Date | null
      endDate: Date | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
      userId: string
      roleId: string
    }, ExtArgs["result"]["userRole"]>
    composites: {}
  }

  type UserRoleGetPayload<S extends boolean | null | undefined | UserRoleDefaultArgs> = $Result.GetResult<Prisma.$UserRolePayload, S>

  type UserRoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserRoleCountAggregateInputType | true
    }

  export interface UserRoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserRole'], meta: { name: 'UserRole' } }
    /**
     * Find zero or one UserRole that matches the filter.
     * @param {UserRoleFindUniqueArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserRoleFindUniqueArgs>(args: SelectSubset<T, UserRoleFindUniqueArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserRole that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserRoleFindUniqueOrThrowArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserRoleFindUniqueOrThrowArgs>(args: SelectSubset<T, UserRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindFirstArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserRoleFindFirstArgs>(args?: SelectSubset<T, UserRoleFindFirstArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindFirstOrThrowArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserRoleFindFirstOrThrowArgs>(args?: SelectSubset<T, UserRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserRoles
     * const userRoles = await prisma.userRole.findMany()
     * 
     * // Get first 10 UserRoles
     * const userRoles = await prisma.userRole.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userRoleWithIdOnly = await prisma.userRole.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserRoleFindManyArgs>(args?: SelectSubset<T, UserRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserRole.
     * @param {UserRoleCreateArgs} args - Arguments to create a UserRole.
     * @example
     * // Create one UserRole
     * const UserRole = await prisma.userRole.create({
     *   data: {
     *     // ... data to create a UserRole
     *   }
     * })
     * 
     */
    create<T extends UserRoleCreateArgs>(args: SelectSubset<T, UserRoleCreateArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserRoles.
     * @param {UserRoleCreateManyArgs} args - Arguments to create many UserRoles.
     * @example
     * // Create many UserRoles
     * const userRole = await prisma.userRole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserRoleCreateManyArgs>(args?: SelectSubset<T, UserRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserRoles and returns the data saved in the database.
     * @param {UserRoleCreateManyAndReturnArgs} args - Arguments to create many UserRoles.
     * @example
     * // Create many UserRoles
     * const userRole = await prisma.userRole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserRoles and only return the `id`
     * const userRoleWithIdOnly = await prisma.userRole.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserRoleCreateManyAndReturnArgs>(args?: SelectSubset<T, UserRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserRole.
     * @param {UserRoleDeleteArgs} args - Arguments to delete one UserRole.
     * @example
     * // Delete one UserRole
     * const UserRole = await prisma.userRole.delete({
     *   where: {
     *     // ... filter to delete one UserRole
     *   }
     * })
     * 
     */
    delete<T extends UserRoleDeleteArgs>(args: SelectSubset<T, UserRoleDeleteArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserRole.
     * @param {UserRoleUpdateArgs} args - Arguments to update one UserRole.
     * @example
     * // Update one UserRole
     * const userRole = await prisma.userRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserRoleUpdateArgs>(args: SelectSubset<T, UserRoleUpdateArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserRoles.
     * @param {UserRoleDeleteManyArgs} args - Arguments to filter UserRoles to delete.
     * @example
     * // Delete a few UserRoles
     * const { count } = await prisma.userRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserRoleDeleteManyArgs>(args?: SelectSubset<T, UserRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserRoles
     * const userRole = await prisma.userRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserRoleUpdateManyArgs>(args: SelectSubset<T, UserRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRoles and returns the data updated in the database.
     * @param {UserRoleUpdateManyAndReturnArgs} args - Arguments to update many UserRoles.
     * @example
     * // Update many UserRoles
     * const userRole = await prisma.userRole.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserRoles and only return the `id`
     * const userRoleWithIdOnly = await prisma.userRole.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserRoleUpdateManyAndReturnArgs>(args: SelectSubset<T, UserRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserRole.
     * @param {UserRoleUpsertArgs} args - Arguments to update or create a UserRole.
     * @example
     * // Update or create a UserRole
     * const userRole = await prisma.userRole.upsert({
     *   create: {
     *     // ... data to create a UserRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserRole we want to update
     *   }
     * })
     */
    upsert<T extends UserRoleUpsertArgs>(args: SelectSubset<T, UserRoleUpsertArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleCountArgs} args - Arguments to filter UserRoles to count.
     * @example
     * // Count the number of UserRoles
     * const count = await prisma.userRole.count({
     *   where: {
     *     // ... the filter for the UserRoles we want to count
     *   }
     * })
    **/
    count<T extends UserRoleCountArgs>(
      args?: Subset<T, UserRoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserRoleAggregateArgs>(args: Subset<T, UserRoleAggregateArgs>): Prisma.PrismaPromise<GetUserRoleAggregateType<T>>

    /**
     * Group by UserRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserRoleGroupByArgs['orderBy'] }
        : { orderBy?: UserRoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserRole model
   */
  readonly fields: UserRoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserRoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserRole model
   */
  interface UserRoleFieldRefs {
    readonly id: FieldRef<"UserRole", 'String'>
    readonly transactionDate: FieldRef<"UserRole", 'DateTime'>
    readonly startDate: FieldRef<"UserRole", 'DateTime'>
    readonly endDate: FieldRef<"UserRole", 'DateTime'>
    readonly createdBy: FieldRef<"UserRole", 'String'>
    readonly updatedBy: FieldRef<"UserRole", 'String'>
    readonly createdAt: FieldRef<"UserRole", 'DateTime'>
    readonly updatedAt: FieldRef<"UserRole", 'DateTime'>
    readonly userId: FieldRef<"UserRole", 'String'>
    readonly roleId: FieldRef<"UserRole", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserRole findUnique
   */
  export type UserRoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole findUniqueOrThrow
   */
  export type UserRoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole findFirst
   */
  export type UserRoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRoles.
     */
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole findFirstOrThrow
   */
  export type UserRoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRoles.
     */
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole findMany
   */
  export type UserRoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRoles to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole create
   */
  export type UserRoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The data needed to create a UserRole.
     */
    data: XOR<UserRoleCreateInput, UserRoleUncheckedCreateInput>
  }

  /**
   * UserRole createMany
   */
  export type UserRoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserRoles.
     */
    data: UserRoleCreateManyInput | UserRoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserRole createManyAndReturn
   */
  export type UserRoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * The data used to create many UserRoles.
     */
    data: UserRoleCreateManyInput | UserRoleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRole update
   */
  export type UserRoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The data needed to update a UserRole.
     */
    data: XOR<UserRoleUpdateInput, UserRoleUncheckedUpdateInput>
    /**
     * Choose, which UserRole to update.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole updateMany
   */
  export type UserRoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserRoles.
     */
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyInput>
    /**
     * Filter which UserRoles to update
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to update.
     */
    limit?: number
  }

  /**
   * UserRole updateManyAndReturn
   */
  export type UserRoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * The data used to update UserRoles.
     */
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyInput>
    /**
     * Filter which UserRoles to update
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRole upsert
   */
  export type UserRoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The filter to search for the UserRole to update in case it exists.
     */
    where: UserRoleWhereUniqueInput
    /**
     * In case the UserRole found by the `where` argument doesn't exist, create a new UserRole with this data.
     */
    create: XOR<UserRoleCreateInput, UserRoleUncheckedCreateInput>
    /**
     * In case the UserRole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserRoleUpdateInput, UserRoleUncheckedUpdateInput>
  }

  /**
   * UserRole delete
   */
  export type UserRoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter which UserRole to delete.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole deleteMany
   */
  export type UserRoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRoles to delete
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to delete.
     */
    limit?: number
  }

  /**
   * UserRole without action
   */
  export type UserRoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
  }


  /**
   * Model RolePrivilege
   */

  export type AggregateRolePrivilege = {
    _count: RolePrivilegeCountAggregateOutputType | null
    _min: RolePrivilegeMinAggregateOutputType | null
    _max: RolePrivilegeMaxAggregateOutputType | null
  }

  export type RolePrivilegeMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    roleId: string | null
    privilegeId: string | null
  }

  export type RolePrivilegeMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    roleId: string | null
    privilegeId: string | null
  }

  export type RolePrivilegeCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    roleId: number
    privilegeId: number
    _all: number
  }


  export type RolePrivilegeMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    roleId?: true
    privilegeId?: true
  }

  export type RolePrivilegeMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    roleId?: true
    privilegeId?: true
  }

  export type RolePrivilegeCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    roleId?: true
    privilegeId?: true
    _all?: true
  }

  export type RolePrivilegeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePrivilege to aggregate.
     */
    where?: RolePrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePrivileges to fetch.
     */
    orderBy?: RolePrivilegeOrderByWithRelationInput | RolePrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RolePrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePrivileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePrivileges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RolePrivileges
    **/
    _count?: true | RolePrivilegeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolePrivilegeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolePrivilegeMaxAggregateInputType
  }

  export type GetRolePrivilegeAggregateType<T extends RolePrivilegeAggregateArgs> = {
        [P in keyof T & keyof AggregateRolePrivilege]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRolePrivilege[P]>
      : GetScalarType<T[P], AggregateRolePrivilege[P]>
  }




  export type RolePrivilegeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePrivilegeWhereInput
    orderBy?: RolePrivilegeOrderByWithAggregationInput | RolePrivilegeOrderByWithAggregationInput[]
    by: RolePrivilegeScalarFieldEnum[] | RolePrivilegeScalarFieldEnum
    having?: RolePrivilegeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolePrivilegeCountAggregateInputType | true
    _min?: RolePrivilegeMinAggregateInputType
    _max?: RolePrivilegeMaxAggregateInputType
  }

  export type RolePrivilegeGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    roleId: string
    privilegeId: string
    _count: RolePrivilegeCountAggregateOutputType | null
    _min: RolePrivilegeMinAggregateOutputType | null
    _max: RolePrivilegeMaxAggregateOutputType | null
  }

  type GetRolePrivilegeGroupByPayload<T extends RolePrivilegeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolePrivilegeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolePrivilegeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolePrivilegeGroupByOutputType[P]>
            : GetScalarType<T[P], RolePrivilegeGroupByOutputType[P]>
        }
      >
    >


  export type RolePrivilegeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roleId?: boolean
    privilegeId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    privilege?: boolean | PrivilegeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePrivilege"]>

  export type RolePrivilegeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roleId?: boolean
    privilegeId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    privilege?: boolean | PrivilegeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePrivilege"]>

  export type RolePrivilegeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roleId?: boolean
    privilegeId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    privilege?: boolean | PrivilegeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePrivilege"]>

  export type RolePrivilegeSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roleId?: boolean
    privilegeId?: boolean
  }

  export type RolePrivilegeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "roleId" | "privilegeId", ExtArgs["result"]["rolePrivilege"]>
  export type RolePrivilegeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    privilege?: boolean | PrivilegeDefaultArgs<ExtArgs>
  }
  export type RolePrivilegeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    privilege?: boolean | PrivilegeDefaultArgs<ExtArgs>
  }
  export type RolePrivilegeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    privilege?: boolean | PrivilegeDefaultArgs<ExtArgs>
  }

  export type $RolePrivilegePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RolePrivilege"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      privilege: Prisma.$PrivilegePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionDate: Date
      startDate: Date | null
      endDate: Date | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
      roleId: string
      privilegeId: string
    }, ExtArgs["result"]["rolePrivilege"]>
    composites: {}
  }

  type RolePrivilegeGetPayload<S extends boolean | null | undefined | RolePrivilegeDefaultArgs> = $Result.GetResult<Prisma.$RolePrivilegePayload, S>

  type RolePrivilegeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RolePrivilegeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolePrivilegeCountAggregateInputType | true
    }

  export interface RolePrivilegeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RolePrivilege'], meta: { name: 'RolePrivilege' } }
    /**
     * Find zero or one RolePrivilege that matches the filter.
     * @param {RolePrivilegeFindUniqueArgs} args - Arguments to find a RolePrivilege
     * @example
     * // Get one RolePrivilege
     * const rolePrivilege = await prisma.rolePrivilege.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RolePrivilegeFindUniqueArgs>(args: SelectSubset<T, RolePrivilegeFindUniqueArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RolePrivilege that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RolePrivilegeFindUniqueOrThrowArgs} args - Arguments to find a RolePrivilege
     * @example
     * // Get one RolePrivilege
     * const rolePrivilege = await prisma.rolePrivilege.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RolePrivilegeFindUniqueOrThrowArgs>(args: SelectSubset<T, RolePrivilegeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePrivilege that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePrivilegeFindFirstArgs} args - Arguments to find a RolePrivilege
     * @example
     * // Get one RolePrivilege
     * const rolePrivilege = await prisma.rolePrivilege.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RolePrivilegeFindFirstArgs>(args?: SelectSubset<T, RolePrivilegeFindFirstArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePrivilege that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePrivilegeFindFirstOrThrowArgs} args - Arguments to find a RolePrivilege
     * @example
     * // Get one RolePrivilege
     * const rolePrivilege = await prisma.rolePrivilege.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RolePrivilegeFindFirstOrThrowArgs>(args?: SelectSubset<T, RolePrivilegeFindFirstOrThrowArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RolePrivileges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePrivilegeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RolePrivileges
     * const rolePrivileges = await prisma.rolePrivilege.findMany()
     * 
     * // Get first 10 RolePrivileges
     * const rolePrivileges = await prisma.rolePrivilege.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rolePrivilegeWithIdOnly = await prisma.rolePrivilege.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RolePrivilegeFindManyArgs>(args?: SelectSubset<T, RolePrivilegeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RolePrivilege.
     * @param {RolePrivilegeCreateArgs} args - Arguments to create a RolePrivilege.
     * @example
     * // Create one RolePrivilege
     * const RolePrivilege = await prisma.rolePrivilege.create({
     *   data: {
     *     // ... data to create a RolePrivilege
     *   }
     * })
     * 
     */
    create<T extends RolePrivilegeCreateArgs>(args: SelectSubset<T, RolePrivilegeCreateArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RolePrivileges.
     * @param {RolePrivilegeCreateManyArgs} args - Arguments to create many RolePrivileges.
     * @example
     * // Create many RolePrivileges
     * const rolePrivilege = await prisma.rolePrivilege.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RolePrivilegeCreateManyArgs>(args?: SelectSubset<T, RolePrivilegeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RolePrivileges and returns the data saved in the database.
     * @param {RolePrivilegeCreateManyAndReturnArgs} args - Arguments to create many RolePrivileges.
     * @example
     * // Create many RolePrivileges
     * const rolePrivilege = await prisma.rolePrivilege.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RolePrivileges and only return the `id`
     * const rolePrivilegeWithIdOnly = await prisma.rolePrivilege.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RolePrivilegeCreateManyAndReturnArgs>(args?: SelectSubset<T, RolePrivilegeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RolePrivilege.
     * @param {RolePrivilegeDeleteArgs} args - Arguments to delete one RolePrivilege.
     * @example
     * // Delete one RolePrivilege
     * const RolePrivilege = await prisma.rolePrivilege.delete({
     *   where: {
     *     // ... filter to delete one RolePrivilege
     *   }
     * })
     * 
     */
    delete<T extends RolePrivilegeDeleteArgs>(args: SelectSubset<T, RolePrivilegeDeleteArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RolePrivilege.
     * @param {RolePrivilegeUpdateArgs} args - Arguments to update one RolePrivilege.
     * @example
     * // Update one RolePrivilege
     * const rolePrivilege = await prisma.rolePrivilege.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RolePrivilegeUpdateArgs>(args: SelectSubset<T, RolePrivilegeUpdateArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RolePrivileges.
     * @param {RolePrivilegeDeleteManyArgs} args - Arguments to filter RolePrivileges to delete.
     * @example
     * // Delete a few RolePrivileges
     * const { count } = await prisma.rolePrivilege.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RolePrivilegeDeleteManyArgs>(args?: SelectSubset<T, RolePrivilegeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePrivileges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePrivilegeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RolePrivileges
     * const rolePrivilege = await prisma.rolePrivilege.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RolePrivilegeUpdateManyArgs>(args: SelectSubset<T, RolePrivilegeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePrivileges and returns the data updated in the database.
     * @param {RolePrivilegeUpdateManyAndReturnArgs} args - Arguments to update many RolePrivileges.
     * @example
     * // Update many RolePrivileges
     * const rolePrivilege = await prisma.rolePrivilege.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RolePrivileges and only return the `id`
     * const rolePrivilegeWithIdOnly = await prisma.rolePrivilege.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RolePrivilegeUpdateManyAndReturnArgs>(args: SelectSubset<T, RolePrivilegeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RolePrivilege.
     * @param {RolePrivilegeUpsertArgs} args - Arguments to update or create a RolePrivilege.
     * @example
     * // Update or create a RolePrivilege
     * const rolePrivilege = await prisma.rolePrivilege.upsert({
     *   create: {
     *     // ... data to create a RolePrivilege
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RolePrivilege we want to update
     *   }
     * })
     */
    upsert<T extends RolePrivilegeUpsertArgs>(args: SelectSubset<T, RolePrivilegeUpsertArgs<ExtArgs>>): Prisma__RolePrivilegeClient<$Result.GetResult<Prisma.$RolePrivilegePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RolePrivileges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePrivilegeCountArgs} args - Arguments to filter RolePrivileges to count.
     * @example
     * // Count the number of RolePrivileges
     * const count = await prisma.rolePrivilege.count({
     *   where: {
     *     // ... the filter for the RolePrivileges we want to count
     *   }
     * })
    **/
    count<T extends RolePrivilegeCountArgs>(
      args?: Subset<T, RolePrivilegeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolePrivilegeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RolePrivilege.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePrivilegeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolePrivilegeAggregateArgs>(args: Subset<T, RolePrivilegeAggregateArgs>): Prisma.PrismaPromise<GetRolePrivilegeAggregateType<T>>

    /**
     * Group by RolePrivilege.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePrivilegeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RolePrivilegeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RolePrivilegeGroupByArgs['orderBy'] }
        : { orderBy?: RolePrivilegeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RolePrivilegeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolePrivilegeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RolePrivilege model
   */
  readonly fields: RolePrivilegeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RolePrivilege.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RolePrivilegeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    privilege<T extends PrivilegeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PrivilegeDefaultArgs<ExtArgs>>): Prisma__PrivilegeClient<$Result.GetResult<Prisma.$PrivilegePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RolePrivilege model
   */
  interface RolePrivilegeFieldRefs {
    readonly id: FieldRef<"RolePrivilege", 'String'>
    readonly transactionDate: FieldRef<"RolePrivilege", 'DateTime'>
    readonly startDate: FieldRef<"RolePrivilege", 'DateTime'>
    readonly endDate: FieldRef<"RolePrivilege", 'DateTime'>
    readonly createdBy: FieldRef<"RolePrivilege", 'String'>
    readonly updatedBy: FieldRef<"RolePrivilege", 'String'>
    readonly createdAt: FieldRef<"RolePrivilege", 'DateTime'>
    readonly updatedAt: FieldRef<"RolePrivilege", 'DateTime'>
    readonly roleId: FieldRef<"RolePrivilege", 'String'>
    readonly privilegeId: FieldRef<"RolePrivilege", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RolePrivilege findUnique
   */
  export type RolePrivilegeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which RolePrivilege to fetch.
     */
    where: RolePrivilegeWhereUniqueInput
  }

  /**
   * RolePrivilege findUniqueOrThrow
   */
  export type RolePrivilegeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which RolePrivilege to fetch.
     */
    where: RolePrivilegeWhereUniqueInput
  }

  /**
   * RolePrivilege findFirst
   */
  export type RolePrivilegeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which RolePrivilege to fetch.
     */
    where?: RolePrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePrivileges to fetch.
     */
    orderBy?: RolePrivilegeOrderByWithRelationInput | RolePrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePrivileges.
     */
    cursor?: RolePrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePrivileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePrivileges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePrivileges.
     */
    distinct?: RolePrivilegeScalarFieldEnum | RolePrivilegeScalarFieldEnum[]
  }

  /**
   * RolePrivilege findFirstOrThrow
   */
  export type RolePrivilegeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which RolePrivilege to fetch.
     */
    where?: RolePrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePrivileges to fetch.
     */
    orderBy?: RolePrivilegeOrderByWithRelationInput | RolePrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePrivileges.
     */
    cursor?: RolePrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePrivileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePrivileges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePrivileges.
     */
    distinct?: RolePrivilegeScalarFieldEnum | RolePrivilegeScalarFieldEnum[]
  }

  /**
   * RolePrivilege findMany
   */
  export type RolePrivilegeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * Filter, which RolePrivileges to fetch.
     */
    where?: RolePrivilegeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePrivileges to fetch.
     */
    orderBy?: RolePrivilegeOrderByWithRelationInput | RolePrivilegeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RolePrivileges.
     */
    cursor?: RolePrivilegeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePrivileges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePrivileges.
     */
    skip?: number
    distinct?: RolePrivilegeScalarFieldEnum | RolePrivilegeScalarFieldEnum[]
  }

  /**
   * RolePrivilege create
   */
  export type RolePrivilegeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * The data needed to create a RolePrivilege.
     */
    data: XOR<RolePrivilegeCreateInput, RolePrivilegeUncheckedCreateInput>
  }

  /**
   * RolePrivilege createMany
   */
  export type RolePrivilegeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RolePrivileges.
     */
    data: RolePrivilegeCreateManyInput | RolePrivilegeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RolePrivilege createManyAndReturn
   */
  export type RolePrivilegeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * The data used to create many RolePrivileges.
     */
    data: RolePrivilegeCreateManyInput | RolePrivilegeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePrivilege update
   */
  export type RolePrivilegeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * The data needed to update a RolePrivilege.
     */
    data: XOR<RolePrivilegeUpdateInput, RolePrivilegeUncheckedUpdateInput>
    /**
     * Choose, which RolePrivilege to update.
     */
    where: RolePrivilegeWhereUniqueInput
  }

  /**
   * RolePrivilege updateMany
   */
  export type RolePrivilegeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RolePrivileges.
     */
    data: XOR<RolePrivilegeUpdateManyMutationInput, RolePrivilegeUncheckedUpdateManyInput>
    /**
     * Filter which RolePrivileges to update
     */
    where?: RolePrivilegeWhereInput
    /**
     * Limit how many RolePrivileges to update.
     */
    limit?: number
  }

  /**
   * RolePrivilege updateManyAndReturn
   */
  export type RolePrivilegeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * The data used to update RolePrivileges.
     */
    data: XOR<RolePrivilegeUpdateManyMutationInput, RolePrivilegeUncheckedUpdateManyInput>
    /**
     * Filter which RolePrivileges to update
     */
    where?: RolePrivilegeWhereInput
    /**
     * Limit how many RolePrivileges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePrivilege upsert
   */
  export type RolePrivilegeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * The filter to search for the RolePrivilege to update in case it exists.
     */
    where: RolePrivilegeWhereUniqueInput
    /**
     * In case the RolePrivilege found by the `where` argument doesn't exist, create a new RolePrivilege with this data.
     */
    create: XOR<RolePrivilegeCreateInput, RolePrivilegeUncheckedCreateInput>
    /**
     * In case the RolePrivilege was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RolePrivilegeUpdateInput, RolePrivilegeUncheckedUpdateInput>
  }

  /**
   * RolePrivilege delete
   */
  export type RolePrivilegeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
    /**
     * Filter which RolePrivilege to delete.
     */
    where: RolePrivilegeWhereUniqueInput
  }

  /**
   * RolePrivilege deleteMany
   */
  export type RolePrivilegeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePrivileges to delete
     */
    where?: RolePrivilegeWhereInput
    /**
     * Limit how many RolePrivileges to delete.
     */
    limit?: number
  }

  /**
   * RolePrivilege without action
   */
  export type RolePrivilegeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePrivilege
     */
    select?: RolePrivilegeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePrivilege
     */
    omit?: RolePrivilegeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePrivilegeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    fullName: 'fullName',
    email: 'email',
    passwordHash: 'passwordHash',
    active: 'active'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    active: 'active'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const PrivilegeScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    code: 'code',
    action: 'action',
    moduleId: 'moduleId'
  };

  export type PrivilegeScalarFieldEnum = (typeof PrivilegeScalarFieldEnum)[keyof typeof PrivilegeScalarFieldEnum]


  export const SystemModuleScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    key: 'key',
    name: 'name'
  };

  export type SystemModuleScalarFieldEnum = (typeof SystemModuleScalarFieldEnum)[keyof typeof SystemModuleScalarFieldEnum]


  export const UserRoleScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    roleId: 'roleId'
  };

  export type UserRoleScalarFieldEnum = (typeof UserRoleScalarFieldEnum)[keyof typeof UserRoleScalarFieldEnum]


  export const RolePrivilegeScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    roleId: 'roleId',
    privilegeId: 'privilegeId'
  };

  export type RolePrivilegeScalarFieldEnum = (typeof RolePrivilegeScalarFieldEnum)[keyof typeof RolePrivilegeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    transactionDate?: DateTimeFilter<"User"> | Date | string
    startDate?: DateTimeNullableFilter<"User"> | Date | string | null
    endDate?: DateTimeNullableFilter<"User"> | Date | string | null
    createdBy?: StringNullableFilter<"User"> | string | null
    updatedBy?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    active?: BoolFilter<"User"> | boolean
    userRoles?: UserRoleListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
    userRoles?: UserRoleOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    transactionDate?: DateTimeFilter<"User"> | Date | string
    startDate?: DateTimeNullableFilter<"User"> | Date | string | null
    endDate?: DateTimeNullableFilter<"User"> | Date | string | null
    createdBy?: StringNullableFilter<"User"> | string | null
    updatedBy?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    fullName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    active?: BoolFilter<"User"> | boolean
    userRoles?: UserRoleListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"User"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"User"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    active?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: UuidFilter<"Role"> | string
    transactionDate?: DateTimeFilter<"Role"> | Date | string
    startDate?: DateTimeNullableFilter<"Role"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Role"> | Date | string | null
    createdBy?: StringNullableFilter<"Role"> | string | null
    updatedBy?: StringNullableFilter<"Role"> | string | null
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    name?: StringFilter<"Role"> | string
    active?: BoolFilter<"Role"> | boolean
    rolePrivileges?: RolePrivilegeListRelationFilter
    userRoles?: UserRoleListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    active?: SortOrder
    rolePrivileges?: RolePrivilegeOrderByRelationAggregateInput
    userRoles?: UserRoleOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    transactionDate?: DateTimeFilter<"Role"> | Date | string
    startDate?: DateTimeNullableFilter<"Role"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Role"> | Date | string | null
    createdBy?: StringNullableFilter<"Role"> | string | null
    updatedBy?: StringNullableFilter<"Role"> | string | null
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    active?: BoolFilter<"Role"> | boolean
    rolePrivileges?: RolePrivilegeListRelationFilter
    userRoles?: UserRoleListRelationFilter
  }, "id" | "name">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    active?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Role"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Role"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Role"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Role"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Role"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    name?: StringWithAggregatesFilter<"Role"> | string
    active?: BoolWithAggregatesFilter<"Role"> | boolean
  }

  export type PrivilegeWhereInput = {
    AND?: PrivilegeWhereInput | PrivilegeWhereInput[]
    OR?: PrivilegeWhereInput[]
    NOT?: PrivilegeWhereInput | PrivilegeWhereInput[]
    id?: UuidFilter<"Privilege"> | string
    transactionDate?: DateTimeFilter<"Privilege"> | Date | string
    startDate?: DateTimeNullableFilter<"Privilege"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Privilege"> | Date | string | null
    createdBy?: StringNullableFilter<"Privilege"> | string | null
    updatedBy?: StringNullableFilter<"Privilege"> | string | null
    createdAt?: DateTimeFilter<"Privilege"> | Date | string
    updatedAt?: DateTimeFilter<"Privilege"> | Date | string
    code?: StringFilter<"Privilege"> | string
    action?: StringFilter<"Privilege"> | string
    moduleId?: UuidFilter<"Privilege"> | string
    module?: XOR<SystemModuleScalarRelationFilter, SystemModuleWhereInput>
    rolePrivileges?: RolePrivilegeListRelationFilter
  }

  export type PrivilegeOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    action?: SortOrder
    moduleId?: SortOrder
    module?: SystemModuleOrderByWithRelationInput
    rolePrivileges?: RolePrivilegeOrderByRelationAggregateInput
  }

  export type PrivilegeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: PrivilegeWhereInput | PrivilegeWhereInput[]
    OR?: PrivilegeWhereInput[]
    NOT?: PrivilegeWhereInput | PrivilegeWhereInput[]
    transactionDate?: DateTimeFilter<"Privilege"> | Date | string
    startDate?: DateTimeNullableFilter<"Privilege"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Privilege"> | Date | string | null
    createdBy?: StringNullableFilter<"Privilege"> | string | null
    updatedBy?: StringNullableFilter<"Privilege"> | string | null
    createdAt?: DateTimeFilter<"Privilege"> | Date | string
    updatedAt?: DateTimeFilter<"Privilege"> | Date | string
    action?: StringFilter<"Privilege"> | string
    moduleId?: UuidFilter<"Privilege"> | string
    module?: XOR<SystemModuleScalarRelationFilter, SystemModuleWhereInput>
    rolePrivileges?: RolePrivilegeListRelationFilter
  }, "id" | "code">

  export type PrivilegeOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    action?: SortOrder
    moduleId?: SortOrder
    _count?: PrivilegeCountOrderByAggregateInput
    _max?: PrivilegeMaxOrderByAggregateInput
    _min?: PrivilegeMinOrderByAggregateInput
  }

  export type PrivilegeScalarWhereWithAggregatesInput = {
    AND?: PrivilegeScalarWhereWithAggregatesInput | PrivilegeScalarWhereWithAggregatesInput[]
    OR?: PrivilegeScalarWhereWithAggregatesInput[]
    NOT?: PrivilegeScalarWhereWithAggregatesInput | PrivilegeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Privilege"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Privilege"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Privilege"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Privilege"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Privilege"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Privilege"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Privilege"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Privilege"> | Date | string
    code?: StringWithAggregatesFilter<"Privilege"> | string
    action?: StringWithAggregatesFilter<"Privilege"> | string
    moduleId?: UuidWithAggregatesFilter<"Privilege"> | string
  }

  export type SystemModuleWhereInput = {
    AND?: SystemModuleWhereInput | SystemModuleWhereInput[]
    OR?: SystemModuleWhereInput[]
    NOT?: SystemModuleWhereInput | SystemModuleWhereInput[]
    id?: UuidFilter<"SystemModule"> | string
    transactionDate?: DateTimeFilter<"SystemModule"> | Date | string
    startDate?: DateTimeNullableFilter<"SystemModule"> | Date | string | null
    endDate?: DateTimeNullableFilter<"SystemModule"> | Date | string | null
    createdBy?: StringNullableFilter<"SystemModule"> | string | null
    updatedBy?: StringNullableFilter<"SystemModule"> | string | null
    createdAt?: DateTimeFilter<"SystemModule"> | Date | string
    updatedAt?: DateTimeFilter<"SystemModule"> | Date | string
    key?: StringFilter<"SystemModule"> | string
    name?: StringFilter<"SystemModule"> | string
    privileges?: PrivilegeListRelationFilter
  }

  export type SystemModuleOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    key?: SortOrder
    name?: SortOrder
    privileges?: PrivilegeOrderByRelationAggregateInput
  }

  export type SystemModuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SystemModuleWhereInput | SystemModuleWhereInput[]
    OR?: SystemModuleWhereInput[]
    NOT?: SystemModuleWhereInput | SystemModuleWhereInput[]
    transactionDate?: DateTimeFilter<"SystemModule"> | Date | string
    startDate?: DateTimeNullableFilter<"SystemModule"> | Date | string | null
    endDate?: DateTimeNullableFilter<"SystemModule"> | Date | string | null
    createdBy?: StringNullableFilter<"SystemModule"> | string | null
    updatedBy?: StringNullableFilter<"SystemModule"> | string | null
    createdAt?: DateTimeFilter<"SystemModule"> | Date | string
    updatedAt?: DateTimeFilter<"SystemModule"> | Date | string
    name?: StringFilter<"SystemModule"> | string
    privileges?: PrivilegeListRelationFilter
  }, "id" | "key">

  export type SystemModuleOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    key?: SortOrder
    name?: SortOrder
    _count?: SystemModuleCountOrderByAggregateInput
    _max?: SystemModuleMaxOrderByAggregateInput
    _min?: SystemModuleMinOrderByAggregateInput
  }

  export type SystemModuleScalarWhereWithAggregatesInput = {
    AND?: SystemModuleScalarWhereWithAggregatesInput | SystemModuleScalarWhereWithAggregatesInput[]
    OR?: SystemModuleScalarWhereWithAggregatesInput[]
    NOT?: SystemModuleScalarWhereWithAggregatesInput | SystemModuleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SystemModule"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"SystemModule"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"SystemModule"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"SystemModule"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"SystemModule"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"SystemModule"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SystemModule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SystemModule"> | Date | string
    key?: StringWithAggregatesFilter<"SystemModule"> | string
    name?: StringWithAggregatesFilter<"SystemModule"> | string
  }

  export type UserRoleWhereInput = {
    AND?: UserRoleWhereInput | UserRoleWhereInput[]
    OR?: UserRoleWhereInput[]
    NOT?: UserRoleWhereInput | UserRoleWhereInput[]
    id?: UuidFilter<"UserRole"> | string
    transactionDate?: DateTimeFilter<"UserRole"> | Date | string
    startDate?: DateTimeNullableFilter<"UserRole"> | Date | string | null
    endDate?: DateTimeNullableFilter<"UserRole"> | Date | string | null
    createdBy?: StringNullableFilter<"UserRole"> | string | null
    updatedBy?: StringNullableFilter<"UserRole"> | string | null
    createdAt?: DateTimeFilter<"UserRole"> | Date | string
    updatedAt?: DateTimeFilter<"UserRole"> | Date | string
    userId?: UuidFilter<"UserRole"> | string
    roleId?: UuidFilter<"UserRole"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }

  export type UserRoleOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
    user?: UserOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
  }

  export type UserRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_roleId?: UserRoleUserIdRoleIdCompoundUniqueInput
    AND?: UserRoleWhereInput | UserRoleWhereInput[]
    OR?: UserRoleWhereInput[]
    NOT?: UserRoleWhereInput | UserRoleWhereInput[]
    transactionDate?: DateTimeFilter<"UserRole"> | Date | string
    startDate?: DateTimeNullableFilter<"UserRole"> | Date | string | null
    endDate?: DateTimeNullableFilter<"UserRole"> | Date | string | null
    createdBy?: StringNullableFilter<"UserRole"> | string | null
    updatedBy?: StringNullableFilter<"UserRole"> | string | null
    createdAt?: DateTimeFilter<"UserRole"> | Date | string
    updatedAt?: DateTimeFilter<"UserRole"> | Date | string
    userId?: UuidFilter<"UserRole"> | string
    roleId?: UuidFilter<"UserRole"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }, "id" | "userId_roleId">

  export type UserRoleOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
    _count?: UserRoleCountOrderByAggregateInput
    _max?: UserRoleMaxOrderByAggregateInput
    _min?: UserRoleMinOrderByAggregateInput
  }

  export type UserRoleScalarWhereWithAggregatesInput = {
    AND?: UserRoleScalarWhereWithAggregatesInput | UserRoleScalarWhereWithAggregatesInput[]
    OR?: UserRoleScalarWhereWithAggregatesInput[]
    NOT?: UserRoleScalarWhereWithAggregatesInput | UserRoleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserRole"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"UserRole"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"UserRole"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"UserRole"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"UserRole"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"UserRole"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserRole"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserRole"> | Date | string
    userId?: UuidWithAggregatesFilter<"UserRole"> | string
    roleId?: UuidWithAggregatesFilter<"UserRole"> | string
  }

  export type RolePrivilegeWhereInput = {
    AND?: RolePrivilegeWhereInput | RolePrivilegeWhereInput[]
    OR?: RolePrivilegeWhereInput[]
    NOT?: RolePrivilegeWhereInput | RolePrivilegeWhereInput[]
    id?: UuidFilter<"RolePrivilege"> | string
    transactionDate?: DateTimeFilter<"RolePrivilege"> | Date | string
    startDate?: DateTimeNullableFilter<"RolePrivilege"> | Date | string | null
    endDate?: DateTimeNullableFilter<"RolePrivilege"> | Date | string | null
    createdBy?: StringNullableFilter<"RolePrivilege"> | string | null
    updatedBy?: StringNullableFilter<"RolePrivilege"> | string | null
    createdAt?: DateTimeFilter<"RolePrivilege"> | Date | string
    updatedAt?: DateTimeFilter<"RolePrivilege"> | Date | string
    roleId?: UuidFilter<"RolePrivilege"> | string
    privilegeId?: UuidFilter<"RolePrivilege"> | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    privilege?: XOR<PrivilegeScalarRelationFilter, PrivilegeWhereInput>
  }

  export type RolePrivilegeOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
    privilegeId?: SortOrder
    role?: RoleOrderByWithRelationInput
    privilege?: PrivilegeOrderByWithRelationInput
  }

  export type RolePrivilegeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roleId_privilegeId?: RolePrivilegeRoleIdPrivilegeIdCompoundUniqueInput
    AND?: RolePrivilegeWhereInput | RolePrivilegeWhereInput[]
    OR?: RolePrivilegeWhereInput[]
    NOT?: RolePrivilegeWhereInput | RolePrivilegeWhereInput[]
    transactionDate?: DateTimeFilter<"RolePrivilege"> | Date | string
    startDate?: DateTimeNullableFilter<"RolePrivilege"> | Date | string | null
    endDate?: DateTimeNullableFilter<"RolePrivilege"> | Date | string | null
    createdBy?: StringNullableFilter<"RolePrivilege"> | string | null
    updatedBy?: StringNullableFilter<"RolePrivilege"> | string | null
    createdAt?: DateTimeFilter<"RolePrivilege"> | Date | string
    updatedAt?: DateTimeFilter<"RolePrivilege"> | Date | string
    roleId?: UuidFilter<"RolePrivilege"> | string
    privilegeId?: UuidFilter<"RolePrivilege"> | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    privilege?: XOR<PrivilegeScalarRelationFilter, PrivilegeWhereInput>
  }, "id" | "roleId_privilegeId">

  export type RolePrivilegeOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
    privilegeId?: SortOrder
    _count?: RolePrivilegeCountOrderByAggregateInput
    _max?: RolePrivilegeMaxOrderByAggregateInput
    _min?: RolePrivilegeMinOrderByAggregateInput
  }

  export type RolePrivilegeScalarWhereWithAggregatesInput = {
    AND?: RolePrivilegeScalarWhereWithAggregatesInput | RolePrivilegeScalarWhereWithAggregatesInput[]
    OR?: RolePrivilegeScalarWhereWithAggregatesInput[]
    NOT?: RolePrivilegeScalarWhereWithAggregatesInput | RolePrivilegeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"RolePrivilege"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"RolePrivilege"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"RolePrivilege"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"RolePrivilege"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"RolePrivilege"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"RolePrivilege"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RolePrivilege"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RolePrivilege"> | Date | string
    roleId?: UuidWithAggregatesFilter<"RolePrivilege"> | string
    privilegeId?: UuidWithAggregatesFilter<"RolePrivilege"> | string
  }

  export type UserCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName: string
    email: string
    passwordHash: string
    active?: boolean
    userRoles?: UserRoleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName: string
    email: string
    passwordHash: string
    active?: boolean
    userRoles?: UserRoleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    userRoles?: UserRoleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    userRoles?: UserRoleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName: string
    email: string
    passwordHash: string
    active?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RoleCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    active?: boolean
    rolePrivileges?: RolePrivilegeCreateNestedManyWithoutRoleInput
    userRoles?: UserRoleCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    active?: boolean
    rolePrivileges?: RolePrivilegeUncheckedCreateNestedManyWithoutRoleInput
    userRoles?: UserRoleUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    rolePrivileges?: RolePrivilegeUpdateManyWithoutRoleNestedInput
    userRoles?: UserRoleUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    rolePrivileges?: RolePrivilegeUncheckedUpdateManyWithoutRoleNestedInput
    userRoles?: UserRoleUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    active?: boolean
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PrivilegeCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
    module: SystemModuleCreateNestedOneWithoutPrivilegesInput
    rolePrivileges?: RolePrivilegeCreateNestedManyWithoutPrivilegeInput
  }

  export type PrivilegeUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
    moduleId: string
    rolePrivileges?: RolePrivilegeUncheckedCreateNestedManyWithoutPrivilegeInput
  }

  export type PrivilegeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    module?: SystemModuleUpdateOneRequiredWithoutPrivilegesNestedInput
    rolePrivileges?: RolePrivilegeUpdateManyWithoutPrivilegeNestedInput
  }

  export type PrivilegeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    rolePrivileges?: RolePrivilegeUncheckedUpdateManyWithoutPrivilegeNestedInput
  }

  export type PrivilegeCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
    moduleId: string
  }

  export type PrivilegeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
  }

  export type PrivilegeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
  }

  export type SystemModuleCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    key: string
    name: string
    privileges?: PrivilegeCreateNestedManyWithoutModuleInput
  }

  export type SystemModuleUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    key: string
    name: string
    privileges?: PrivilegeUncheckedCreateNestedManyWithoutModuleInput
  }

  export type SystemModuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    privileges?: PrivilegeUpdateManyWithoutModuleNestedInput
  }

  export type SystemModuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    privileges?: PrivilegeUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type SystemModuleCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    key: string
    name: string
  }

  export type SystemModuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SystemModuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserRolesInput
    role: RoleCreateNestedOneWithoutUserRolesInput
  }

  export type UserRoleUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    roleId: string
  }

  export type UserRoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserRolesNestedInput
    role?: RoleUpdateOneRequiredWithoutUserRolesNestedInput
  }

  export type UserRoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    roleId: string
  }

  export type UserRoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserRoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePrivilegeCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutRolePrivilegesInput
    privilege: PrivilegeCreateNestedOneWithoutRolePrivilegesInput
  }

  export type RolePrivilegeUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleId: string
    privilegeId: string
  }

  export type RolePrivilegeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutRolePrivilegesNestedInput
    privilege?: PrivilegeUpdateOneRequiredWithoutRolePrivilegesNestedInput
  }

  export type RolePrivilegeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: StringFieldUpdateOperationsInput | string
    privilegeId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePrivilegeCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleId: string
    privilegeId: string
  }

  export type RolePrivilegeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RolePrivilegeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: StringFieldUpdateOperationsInput | string
    privilegeId?: StringFieldUpdateOperationsInput | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserRoleListRelationFilter = {
    every?: UserRoleWhereInput
    some?: UserRoleWhereInput
    none?: UserRoleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type RolePrivilegeListRelationFilter = {
    every?: RolePrivilegeWhereInput
    some?: RolePrivilegeWhereInput
    none?: RolePrivilegeWhereInput
  }

  export type RolePrivilegeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    active?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    active?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    active?: SortOrder
  }

  export type SystemModuleScalarRelationFilter = {
    is?: SystemModuleWhereInput
    isNot?: SystemModuleWhereInput
  }

  export type PrivilegeCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    action?: SortOrder
    moduleId?: SortOrder
  }

  export type PrivilegeMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    action?: SortOrder
    moduleId?: SortOrder
  }

  export type PrivilegeMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    action?: SortOrder
    moduleId?: SortOrder
  }

  export type PrivilegeListRelationFilter = {
    every?: PrivilegeWhereInput
    some?: PrivilegeWhereInput
    none?: PrivilegeWhereInput
  }

  export type PrivilegeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SystemModuleCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    key?: SortOrder
    name?: SortOrder
  }

  export type SystemModuleMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    key?: SortOrder
    name?: SortOrder
  }

  export type SystemModuleMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    key?: SortOrder
    name?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type UserRoleUserIdRoleIdCompoundUniqueInput = {
    userId: string
    roleId: string
  }

  export type UserRoleCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type UserRoleMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type UserRoleMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type PrivilegeScalarRelationFilter = {
    is?: PrivilegeWhereInput
    isNot?: PrivilegeWhereInput
  }

  export type RolePrivilegeRoleIdPrivilegeIdCompoundUniqueInput = {
    roleId: string
    privilegeId: string
  }

  export type RolePrivilegeCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
    privilegeId?: SortOrder
  }

  export type RolePrivilegeMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
    privilegeId?: SortOrder
  }

  export type RolePrivilegeMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
    privilegeId?: SortOrder
  }

  export type UserRoleCreateNestedManyWithoutUserInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type UserRoleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserRoleUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutUserInput | UserRoleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutUserInput | UserRoleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutUserInput | UserRoleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type UserRoleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutUserInput | UserRoleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutUserInput | UserRoleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutUserInput | UserRoleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type RolePrivilegeCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePrivilegeCreateWithoutRoleInput, RolePrivilegeUncheckedCreateWithoutRoleInput> | RolePrivilegeCreateWithoutRoleInput[] | RolePrivilegeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutRoleInput | RolePrivilegeCreateOrConnectWithoutRoleInput[]
    createMany?: RolePrivilegeCreateManyRoleInputEnvelope
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
  }

  export type UserRoleCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type RolePrivilegeUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePrivilegeCreateWithoutRoleInput, RolePrivilegeUncheckedCreateWithoutRoleInput> | RolePrivilegeCreateWithoutRoleInput[] | RolePrivilegeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutRoleInput | RolePrivilegeCreateOrConnectWithoutRoleInput[]
    createMany?: RolePrivilegeCreateManyRoleInputEnvelope
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
  }

  export type UserRoleUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type RolePrivilegeUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePrivilegeCreateWithoutRoleInput, RolePrivilegeUncheckedCreateWithoutRoleInput> | RolePrivilegeCreateWithoutRoleInput[] | RolePrivilegeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutRoleInput | RolePrivilegeCreateOrConnectWithoutRoleInput[]
    upsert?: RolePrivilegeUpsertWithWhereUniqueWithoutRoleInput | RolePrivilegeUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePrivilegeCreateManyRoleInputEnvelope
    set?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    disconnect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    delete?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    update?: RolePrivilegeUpdateWithWhereUniqueWithoutRoleInput | RolePrivilegeUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePrivilegeUpdateManyWithWhereWithoutRoleInput | RolePrivilegeUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePrivilegeScalarWhereInput | RolePrivilegeScalarWhereInput[]
  }

  export type UserRoleUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutRoleInput | UserRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutRoleInput | UserRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutRoleInput | UserRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type RolePrivilegeUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePrivilegeCreateWithoutRoleInput, RolePrivilegeUncheckedCreateWithoutRoleInput> | RolePrivilegeCreateWithoutRoleInput[] | RolePrivilegeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutRoleInput | RolePrivilegeCreateOrConnectWithoutRoleInput[]
    upsert?: RolePrivilegeUpsertWithWhereUniqueWithoutRoleInput | RolePrivilegeUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePrivilegeCreateManyRoleInputEnvelope
    set?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    disconnect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    delete?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    update?: RolePrivilegeUpdateWithWhereUniqueWithoutRoleInput | RolePrivilegeUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePrivilegeUpdateManyWithWhereWithoutRoleInput | RolePrivilegeUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePrivilegeScalarWhereInput | RolePrivilegeScalarWhereInput[]
  }

  export type UserRoleUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutRoleInput | UserRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutRoleInput | UserRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutRoleInput | UserRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type SystemModuleCreateNestedOneWithoutPrivilegesInput = {
    create?: XOR<SystemModuleCreateWithoutPrivilegesInput, SystemModuleUncheckedCreateWithoutPrivilegesInput>
    connectOrCreate?: SystemModuleCreateOrConnectWithoutPrivilegesInput
    connect?: SystemModuleWhereUniqueInput
  }

  export type RolePrivilegeCreateNestedManyWithoutPrivilegeInput = {
    create?: XOR<RolePrivilegeCreateWithoutPrivilegeInput, RolePrivilegeUncheckedCreateWithoutPrivilegeInput> | RolePrivilegeCreateWithoutPrivilegeInput[] | RolePrivilegeUncheckedCreateWithoutPrivilegeInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutPrivilegeInput | RolePrivilegeCreateOrConnectWithoutPrivilegeInput[]
    createMany?: RolePrivilegeCreateManyPrivilegeInputEnvelope
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
  }

  export type RolePrivilegeUncheckedCreateNestedManyWithoutPrivilegeInput = {
    create?: XOR<RolePrivilegeCreateWithoutPrivilegeInput, RolePrivilegeUncheckedCreateWithoutPrivilegeInput> | RolePrivilegeCreateWithoutPrivilegeInput[] | RolePrivilegeUncheckedCreateWithoutPrivilegeInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutPrivilegeInput | RolePrivilegeCreateOrConnectWithoutPrivilegeInput[]
    createMany?: RolePrivilegeCreateManyPrivilegeInputEnvelope
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
  }

  export type SystemModuleUpdateOneRequiredWithoutPrivilegesNestedInput = {
    create?: XOR<SystemModuleCreateWithoutPrivilegesInput, SystemModuleUncheckedCreateWithoutPrivilegesInput>
    connectOrCreate?: SystemModuleCreateOrConnectWithoutPrivilegesInput
    upsert?: SystemModuleUpsertWithoutPrivilegesInput
    connect?: SystemModuleWhereUniqueInput
    update?: XOR<XOR<SystemModuleUpdateToOneWithWhereWithoutPrivilegesInput, SystemModuleUpdateWithoutPrivilegesInput>, SystemModuleUncheckedUpdateWithoutPrivilegesInput>
  }

  export type RolePrivilegeUpdateManyWithoutPrivilegeNestedInput = {
    create?: XOR<RolePrivilegeCreateWithoutPrivilegeInput, RolePrivilegeUncheckedCreateWithoutPrivilegeInput> | RolePrivilegeCreateWithoutPrivilegeInput[] | RolePrivilegeUncheckedCreateWithoutPrivilegeInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutPrivilegeInput | RolePrivilegeCreateOrConnectWithoutPrivilegeInput[]
    upsert?: RolePrivilegeUpsertWithWhereUniqueWithoutPrivilegeInput | RolePrivilegeUpsertWithWhereUniqueWithoutPrivilegeInput[]
    createMany?: RolePrivilegeCreateManyPrivilegeInputEnvelope
    set?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    disconnect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    delete?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    update?: RolePrivilegeUpdateWithWhereUniqueWithoutPrivilegeInput | RolePrivilegeUpdateWithWhereUniqueWithoutPrivilegeInput[]
    updateMany?: RolePrivilegeUpdateManyWithWhereWithoutPrivilegeInput | RolePrivilegeUpdateManyWithWhereWithoutPrivilegeInput[]
    deleteMany?: RolePrivilegeScalarWhereInput | RolePrivilegeScalarWhereInput[]
  }

  export type RolePrivilegeUncheckedUpdateManyWithoutPrivilegeNestedInput = {
    create?: XOR<RolePrivilegeCreateWithoutPrivilegeInput, RolePrivilegeUncheckedCreateWithoutPrivilegeInput> | RolePrivilegeCreateWithoutPrivilegeInput[] | RolePrivilegeUncheckedCreateWithoutPrivilegeInput[]
    connectOrCreate?: RolePrivilegeCreateOrConnectWithoutPrivilegeInput | RolePrivilegeCreateOrConnectWithoutPrivilegeInput[]
    upsert?: RolePrivilegeUpsertWithWhereUniqueWithoutPrivilegeInput | RolePrivilegeUpsertWithWhereUniqueWithoutPrivilegeInput[]
    createMany?: RolePrivilegeCreateManyPrivilegeInputEnvelope
    set?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    disconnect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    delete?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    connect?: RolePrivilegeWhereUniqueInput | RolePrivilegeWhereUniqueInput[]
    update?: RolePrivilegeUpdateWithWhereUniqueWithoutPrivilegeInput | RolePrivilegeUpdateWithWhereUniqueWithoutPrivilegeInput[]
    updateMany?: RolePrivilegeUpdateManyWithWhereWithoutPrivilegeInput | RolePrivilegeUpdateManyWithWhereWithoutPrivilegeInput[]
    deleteMany?: RolePrivilegeScalarWhereInput | RolePrivilegeScalarWhereInput[]
  }

  export type PrivilegeCreateNestedManyWithoutModuleInput = {
    create?: XOR<PrivilegeCreateWithoutModuleInput, PrivilegeUncheckedCreateWithoutModuleInput> | PrivilegeCreateWithoutModuleInput[] | PrivilegeUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PrivilegeCreateOrConnectWithoutModuleInput | PrivilegeCreateOrConnectWithoutModuleInput[]
    createMany?: PrivilegeCreateManyModuleInputEnvelope
    connect?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
  }

  export type PrivilegeUncheckedCreateNestedManyWithoutModuleInput = {
    create?: XOR<PrivilegeCreateWithoutModuleInput, PrivilegeUncheckedCreateWithoutModuleInput> | PrivilegeCreateWithoutModuleInput[] | PrivilegeUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PrivilegeCreateOrConnectWithoutModuleInput | PrivilegeCreateOrConnectWithoutModuleInput[]
    createMany?: PrivilegeCreateManyModuleInputEnvelope
    connect?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
  }

  export type PrivilegeUpdateManyWithoutModuleNestedInput = {
    create?: XOR<PrivilegeCreateWithoutModuleInput, PrivilegeUncheckedCreateWithoutModuleInput> | PrivilegeCreateWithoutModuleInput[] | PrivilegeUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PrivilegeCreateOrConnectWithoutModuleInput | PrivilegeCreateOrConnectWithoutModuleInput[]
    upsert?: PrivilegeUpsertWithWhereUniqueWithoutModuleInput | PrivilegeUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: PrivilegeCreateManyModuleInputEnvelope
    set?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    disconnect?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    delete?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    connect?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    update?: PrivilegeUpdateWithWhereUniqueWithoutModuleInput | PrivilegeUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: PrivilegeUpdateManyWithWhereWithoutModuleInput | PrivilegeUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: PrivilegeScalarWhereInput | PrivilegeScalarWhereInput[]
  }

  export type PrivilegeUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: XOR<PrivilegeCreateWithoutModuleInput, PrivilegeUncheckedCreateWithoutModuleInput> | PrivilegeCreateWithoutModuleInput[] | PrivilegeUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PrivilegeCreateOrConnectWithoutModuleInput | PrivilegeCreateOrConnectWithoutModuleInput[]
    upsert?: PrivilegeUpsertWithWhereUniqueWithoutModuleInput | PrivilegeUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: PrivilegeCreateManyModuleInputEnvelope
    set?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    disconnect?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    delete?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    connect?: PrivilegeWhereUniqueInput | PrivilegeWhereUniqueInput[]
    update?: PrivilegeUpdateWithWhereUniqueWithoutModuleInput | PrivilegeUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: PrivilegeUpdateManyWithWhereWithoutModuleInput | PrivilegeUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: PrivilegeScalarWhereInput | PrivilegeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUserRolesInput = {
    create?: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserRolesInput
    connect?: UserWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutUserRolesInput = {
    create?: XOR<RoleCreateWithoutUserRolesInput, RoleUncheckedCreateWithoutUserRolesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUserRolesInput
    connect?: RoleWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserRolesNestedInput = {
    create?: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserRolesInput
    upsert?: UserUpsertWithoutUserRolesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserRolesInput, UserUpdateWithoutUserRolesInput>, UserUncheckedUpdateWithoutUserRolesInput>
  }

  export type RoleUpdateOneRequiredWithoutUserRolesNestedInput = {
    create?: XOR<RoleCreateWithoutUserRolesInput, RoleUncheckedCreateWithoutUserRolesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUserRolesInput
    upsert?: RoleUpsertWithoutUserRolesInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUserRolesInput, RoleUpdateWithoutUserRolesInput>, RoleUncheckedUpdateWithoutUserRolesInput>
  }

  export type RoleCreateNestedOneWithoutRolePrivilegesInput = {
    create?: XOR<RoleCreateWithoutRolePrivilegesInput, RoleUncheckedCreateWithoutRolePrivilegesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRolePrivilegesInput
    connect?: RoleWhereUniqueInput
  }

  export type PrivilegeCreateNestedOneWithoutRolePrivilegesInput = {
    create?: XOR<PrivilegeCreateWithoutRolePrivilegesInput, PrivilegeUncheckedCreateWithoutRolePrivilegesInput>
    connectOrCreate?: PrivilegeCreateOrConnectWithoutRolePrivilegesInput
    connect?: PrivilegeWhereUniqueInput
  }

  export type RoleUpdateOneRequiredWithoutRolePrivilegesNestedInput = {
    create?: XOR<RoleCreateWithoutRolePrivilegesInput, RoleUncheckedCreateWithoutRolePrivilegesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRolePrivilegesInput
    upsert?: RoleUpsertWithoutRolePrivilegesInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutRolePrivilegesInput, RoleUpdateWithoutRolePrivilegesInput>, RoleUncheckedUpdateWithoutRolePrivilegesInput>
  }

  export type PrivilegeUpdateOneRequiredWithoutRolePrivilegesNestedInput = {
    create?: XOR<PrivilegeCreateWithoutRolePrivilegesInput, PrivilegeUncheckedCreateWithoutRolePrivilegesInput>
    connectOrCreate?: PrivilegeCreateOrConnectWithoutRolePrivilegesInput
    upsert?: PrivilegeUpsertWithoutRolePrivilegesInput
    connect?: PrivilegeWhereUniqueInput
    update?: XOR<XOR<PrivilegeUpdateToOneWithWhereWithoutRolePrivilegesInput, PrivilegeUpdateWithoutRolePrivilegesInput>, PrivilegeUncheckedUpdateWithoutRolePrivilegesInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserRoleCreateWithoutUserInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutUserRolesInput
  }

  export type UserRoleUncheckedCreateWithoutUserInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleId: string
  }

  export type UserRoleCreateOrConnectWithoutUserInput = {
    where: UserRoleWhereUniqueInput
    create: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput>
  }

  export type UserRoleCreateManyUserInputEnvelope = {
    data: UserRoleCreateManyUserInput | UserRoleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserRoleUpsertWithWhereUniqueWithoutUserInput = {
    where: UserRoleWhereUniqueInput
    update: XOR<UserRoleUpdateWithoutUserInput, UserRoleUncheckedUpdateWithoutUserInput>
    create: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput>
  }

  export type UserRoleUpdateWithWhereUniqueWithoutUserInput = {
    where: UserRoleWhereUniqueInput
    data: XOR<UserRoleUpdateWithoutUserInput, UserRoleUncheckedUpdateWithoutUserInput>
  }

  export type UserRoleUpdateManyWithWhereWithoutUserInput = {
    where: UserRoleScalarWhereInput
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyWithoutUserInput>
  }

  export type UserRoleScalarWhereInput = {
    AND?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
    OR?: UserRoleScalarWhereInput[]
    NOT?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
    id?: UuidFilter<"UserRole"> | string
    transactionDate?: DateTimeFilter<"UserRole"> | Date | string
    startDate?: DateTimeNullableFilter<"UserRole"> | Date | string | null
    endDate?: DateTimeNullableFilter<"UserRole"> | Date | string | null
    createdBy?: StringNullableFilter<"UserRole"> | string | null
    updatedBy?: StringNullableFilter<"UserRole"> | string | null
    createdAt?: DateTimeFilter<"UserRole"> | Date | string
    updatedAt?: DateTimeFilter<"UserRole"> | Date | string
    userId?: UuidFilter<"UserRole"> | string
    roleId?: UuidFilter<"UserRole"> | string
  }

  export type RolePrivilegeCreateWithoutRoleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privilege: PrivilegeCreateNestedOneWithoutRolePrivilegesInput
  }

  export type RolePrivilegeUncheckedCreateWithoutRoleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privilegeId: string
  }

  export type RolePrivilegeCreateOrConnectWithoutRoleInput = {
    where: RolePrivilegeWhereUniqueInput
    create: XOR<RolePrivilegeCreateWithoutRoleInput, RolePrivilegeUncheckedCreateWithoutRoleInput>
  }

  export type RolePrivilegeCreateManyRoleInputEnvelope = {
    data: RolePrivilegeCreateManyRoleInput | RolePrivilegeCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserRoleCreateWithoutRoleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserRolesInput
  }

  export type UserRoleUncheckedCreateWithoutRoleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type UserRoleCreateOrConnectWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    create: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput>
  }

  export type UserRoleCreateManyRoleInputEnvelope = {
    data: UserRoleCreateManyRoleInput | UserRoleCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type RolePrivilegeUpsertWithWhereUniqueWithoutRoleInput = {
    where: RolePrivilegeWhereUniqueInput
    update: XOR<RolePrivilegeUpdateWithoutRoleInput, RolePrivilegeUncheckedUpdateWithoutRoleInput>
    create: XOR<RolePrivilegeCreateWithoutRoleInput, RolePrivilegeUncheckedCreateWithoutRoleInput>
  }

  export type RolePrivilegeUpdateWithWhereUniqueWithoutRoleInput = {
    where: RolePrivilegeWhereUniqueInput
    data: XOR<RolePrivilegeUpdateWithoutRoleInput, RolePrivilegeUncheckedUpdateWithoutRoleInput>
  }

  export type RolePrivilegeUpdateManyWithWhereWithoutRoleInput = {
    where: RolePrivilegeScalarWhereInput
    data: XOR<RolePrivilegeUpdateManyMutationInput, RolePrivilegeUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePrivilegeScalarWhereInput = {
    AND?: RolePrivilegeScalarWhereInput | RolePrivilegeScalarWhereInput[]
    OR?: RolePrivilegeScalarWhereInput[]
    NOT?: RolePrivilegeScalarWhereInput | RolePrivilegeScalarWhereInput[]
    id?: UuidFilter<"RolePrivilege"> | string
    transactionDate?: DateTimeFilter<"RolePrivilege"> | Date | string
    startDate?: DateTimeNullableFilter<"RolePrivilege"> | Date | string | null
    endDate?: DateTimeNullableFilter<"RolePrivilege"> | Date | string | null
    createdBy?: StringNullableFilter<"RolePrivilege"> | string | null
    updatedBy?: StringNullableFilter<"RolePrivilege"> | string | null
    createdAt?: DateTimeFilter<"RolePrivilege"> | Date | string
    updatedAt?: DateTimeFilter<"RolePrivilege"> | Date | string
    roleId?: UuidFilter<"RolePrivilege"> | string
    privilegeId?: UuidFilter<"RolePrivilege"> | string
  }

  export type UserRoleUpsertWithWhereUniqueWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    update: XOR<UserRoleUpdateWithoutRoleInput, UserRoleUncheckedUpdateWithoutRoleInput>
    create: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput>
  }

  export type UserRoleUpdateWithWhereUniqueWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    data: XOR<UserRoleUpdateWithoutRoleInput, UserRoleUncheckedUpdateWithoutRoleInput>
  }

  export type UserRoleUpdateManyWithWhereWithoutRoleInput = {
    where: UserRoleScalarWhereInput
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyWithoutRoleInput>
  }

  export type SystemModuleCreateWithoutPrivilegesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    key: string
    name: string
  }

  export type SystemModuleUncheckedCreateWithoutPrivilegesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    key: string
    name: string
  }

  export type SystemModuleCreateOrConnectWithoutPrivilegesInput = {
    where: SystemModuleWhereUniqueInput
    create: XOR<SystemModuleCreateWithoutPrivilegesInput, SystemModuleUncheckedCreateWithoutPrivilegesInput>
  }

  export type RolePrivilegeCreateWithoutPrivilegeInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutRolePrivilegesInput
  }

  export type RolePrivilegeUncheckedCreateWithoutPrivilegeInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleId: string
  }

  export type RolePrivilegeCreateOrConnectWithoutPrivilegeInput = {
    where: RolePrivilegeWhereUniqueInput
    create: XOR<RolePrivilegeCreateWithoutPrivilegeInput, RolePrivilegeUncheckedCreateWithoutPrivilegeInput>
  }

  export type RolePrivilegeCreateManyPrivilegeInputEnvelope = {
    data: RolePrivilegeCreateManyPrivilegeInput | RolePrivilegeCreateManyPrivilegeInput[]
    skipDuplicates?: boolean
  }

  export type SystemModuleUpsertWithoutPrivilegesInput = {
    update: XOR<SystemModuleUpdateWithoutPrivilegesInput, SystemModuleUncheckedUpdateWithoutPrivilegesInput>
    create: XOR<SystemModuleCreateWithoutPrivilegesInput, SystemModuleUncheckedCreateWithoutPrivilegesInput>
    where?: SystemModuleWhereInput
  }

  export type SystemModuleUpdateToOneWithWhereWithoutPrivilegesInput = {
    where?: SystemModuleWhereInput
    data: XOR<SystemModuleUpdateWithoutPrivilegesInput, SystemModuleUncheckedUpdateWithoutPrivilegesInput>
  }

  export type SystemModuleUpdateWithoutPrivilegesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SystemModuleUncheckedUpdateWithoutPrivilegesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type RolePrivilegeUpsertWithWhereUniqueWithoutPrivilegeInput = {
    where: RolePrivilegeWhereUniqueInput
    update: XOR<RolePrivilegeUpdateWithoutPrivilegeInput, RolePrivilegeUncheckedUpdateWithoutPrivilegeInput>
    create: XOR<RolePrivilegeCreateWithoutPrivilegeInput, RolePrivilegeUncheckedCreateWithoutPrivilegeInput>
  }

  export type RolePrivilegeUpdateWithWhereUniqueWithoutPrivilegeInput = {
    where: RolePrivilegeWhereUniqueInput
    data: XOR<RolePrivilegeUpdateWithoutPrivilegeInput, RolePrivilegeUncheckedUpdateWithoutPrivilegeInput>
  }

  export type RolePrivilegeUpdateManyWithWhereWithoutPrivilegeInput = {
    where: RolePrivilegeScalarWhereInput
    data: XOR<RolePrivilegeUpdateManyMutationInput, RolePrivilegeUncheckedUpdateManyWithoutPrivilegeInput>
  }

  export type PrivilegeCreateWithoutModuleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
    rolePrivileges?: RolePrivilegeCreateNestedManyWithoutPrivilegeInput
  }

  export type PrivilegeUncheckedCreateWithoutModuleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
    rolePrivileges?: RolePrivilegeUncheckedCreateNestedManyWithoutPrivilegeInput
  }

  export type PrivilegeCreateOrConnectWithoutModuleInput = {
    where: PrivilegeWhereUniqueInput
    create: XOR<PrivilegeCreateWithoutModuleInput, PrivilegeUncheckedCreateWithoutModuleInput>
  }

  export type PrivilegeCreateManyModuleInputEnvelope = {
    data: PrivilegeCreateManyModuleInput | PrivilegeCreateManyModuleInput[]
    skipDuplicates?: boolean
  }

  export type PrivilegeUpsertWithWhereUniqueWithoutModuleInput = {
    where: PrivilegeWhereUniqueInput
    update: XOR<PrivilegeUpdateWithoutModuleInput, PrivilegeUncheckedUpdateWithoutModuleInput>
    create: XOR<PrivilegeCreateWithoutModuleInput, PrivilegeUncheckedCreateWithoutModuleInput>
  }

  export type PrivilegeUpdateWithWhereUniqueWithoutModuleInput = {
    where: PrivilegeWhereUniqueInput
    data: XOR<PrivilegeUpdateWithoutModuleInput, PrivilegeUncheckedUpdateWithoutModuleInput>
  }

  export type PrivilegeUpdateManyWithWhereWithoutModuleInput = {
    where: PrivilegeScalarWhereInput
    data: XOR<PrivilegeUpdateManyMutationInput, PrivilegeUncheckedUpdateManyWithoutModuleInput>
  }

  export type PrivilegeScalarWhereInput = {
    AND?: PrivilegeScalarWhereInput | PrivilegeScalarWhereInput[]
    OR?: PrivilegeScalarWhereInput[]
    NOT?: PrivilegeScalarWhereInput | PrivilegeScalarWhereInput[]
    id?: UuidFilter<"Privilege"> | string
    transactionDate?: DateTimeFilter<"Privilege"> | Date | string
    startDate?: DateTimeNullableFilter<"Privilege"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Privilege"> | Date | string | null
    createdBy?: StringNullableFilter<"Privilege"> | string | null
    updatedBy?: StringNullableFilter<"Privilege"> | string | null
    createdAt?: DateTimeFilter<"Privilege"> | Date | string
    updatedAt?: DateTimeFilter<"Privilege"> | Date | string
    code?: StringFilter<"Privilege"> | string
    action?: StringFilter<"Privilege"> | string
    moduleId?: UuidFilter<"Privilege"> | string
  }

  export type UserCreateWithoutUserRolesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName: string
    email: string
    passwordHash: string
    active?: boolean
  }

  export type UserUncheckedCreateWithoutUserRolesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName: string
    email: string
    passwordHash: string
    active?: boolean
  }

  export type UserCreateOrConnectWithoutUserRolesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
  }

  export type RoleCreateWithoutUserRolesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    active?: boolean
    rolePrivileges?: RolePrivilegeCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutUserRolesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    active?: boolean
    rolePrivileges?: RolePrivilegeUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutUserRolesInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUserRolesInput, RoleUncheckedCreateWithoutUserRolesInput>
  }

  export type UserUpsertWithoutUserRolesInput = {
    update: XOR<UserUpdateWithoutUserRolesInput, UserUncheckedUpdateWithoutUserRolesInput>
    create: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserRolesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserRolesInput, UserUncheckedUpdateWithoutUserRolesInput>
  }

  export type UserUpdateWithoutUserRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateWithoutUserRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RoleUpsertWithoutUserRolesInput = {
    update: XOR<RoleUpdateWithoutUserRolesInput, RoleUncheckedUpdateWithoutUserRolesInput>
    create: XOR<RoleCreateWithoutUserRolesInput, RoleUncheckedCreateWithoutUserRolesInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUserRolesInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUserRolesInput, RoleUncheckedUpdateWithoutUserRolesInput>
  }

  export type RoleUpdateWithoutUserRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    rolePrivileges?: RolePrivilegeUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutUserRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    rolePrivileges?: RolePrivilegeUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateWithoutRolePrivilegesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    active?: boolean
    userRoles?: UserRoleCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutRolePrivilegesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    active?: boolean
    userRoles?: UserRoleUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutRolePrivilegesInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutRolePrivilegesInput, RoleUncheckedCreateWithoutRolePrivilegesInput>
  }

  export type PrivilegeCreateWithoutRolePrivilegesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
    module: SystemModuleCreateNestedOneWithoutPrivilegesInput
  }

  export type PrivilegeUncheckedCreateWithoutRolePrivilegesInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
    moduleId: string
  }

  export type PrivilegeCreateOrConnectWithoutRolePrivilegesInput = {
    where: PrivilegeWhereUniqueInput
    create: XOR<PrivilegeCreateWithoutRolePrivilegesInput, PrivilegeUncheckedCreateWithoutRolePrivilegesInput>
  }

  export type RoleUpsertWithoutRolePrivilegesInput = {
    update: XOR<RoleUpdateWithoutRolePrivilegesInput, RoleUncheckedUpdateWithoutRolePrivilegesInput>
    create: XOR<RoleCreateWithoutRolePrivilegesInput, RoleUncheckedCreateWithoutRolePrivilegesInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutRolePrivilegesInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutRolePrivilegesInput, RoleUncheckedUpdateWithoutRolePrivilegesInput>
  }

  export type RoleUpdateWithoutRolePrivilegesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    userRoles?: UserRoleUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutRolePrivilegesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    userRoles?: UserRoleUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type PrivilegeUpsertWithoutRolePrivilegesInput = {
    update: XOR<PrivilegeUpdateWithoutRolePrivilegesInput, PrivilegeUncheckedUpdateWithoutRolePrivilegesInput>
    create: XOR<PrivilegeCreateWithoutRolePrivilegesInput, PrivilegeUncheckedCreateWithoutRolePrivilegesInput>
    where?: PrivilegeWhereInput
  }

  export type PrivilegeUpdateToOneWithWhereWithoutRolePrivilegesInput = {
    where?: PrivilegeWhereInput
    data: XOR<PrivilegeUpdateWithoutRolePrivilegesInput, PrivilegeUncheckedUpdateWithoutRolePrivilegesInput>
  }

  export type PrivilegeUpdateWithoutRolePrivilegesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    module?: SystemModuleUpdateOneRequiredWithoutPrivilegesNestedInput
  }

  export type PrivilegeUncheckedUpdateWithoutRolePrivilegesInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleCreateManyUserInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleId: string
  }

  export type UserRoleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutUserRolesNestedInput
  }

  export type UserRoleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePrivilegeCreateManyRoleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privilegeId: string
  }

  export type UserRoleCreateManyRoleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type RolePrivilegeUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privilege?: PrivilegeUpdateOneRequiredWithoutRolePrivilegesNestedInput
  }

  export type RolePrivilegeUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privilegeId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePrivilegeUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privilegeId?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserRolesNestedInput
  }

  export type UserRoleUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePrivilegeCreateManyPrivilegeInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleId: string
  }

  export type RolePrivilegeUpdateWithoutPrivilegeInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutRolePrivilegesNestedInput
  }

  export type RolePrivilegeUncheckedUpdateWithoutPrivilegeInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePrivilegeUncheckedUpdateManyWithoutPrivilegeInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type PrivilegeCreateManyModuleInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    action: string
  }

  export type PrivilegeUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    rolePrivileges?: RolePrivilegeUpdateManyWithoutPrivilegeNestedInput
  }

  export type PrivilegeUncheckedUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    rolePrivileges?: RolePrivilegeUncheckedUpdateManyWithoutPrivilegeNestedInput
  }

  export type PrivilegeUncheckedUpdateManyWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}