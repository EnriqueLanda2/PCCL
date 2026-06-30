
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
 * Model Course
 * 
 */
export type Course = $Result.DefaultSelection<Prisma.$CoursePayload>
/**
 * Model Lesson
 * 
 */
export type Lesson = $Result.DefaultSelection<Prisma.$LessonPayload>
/**
 * Model Inscription
 * 
 */
export type Inscription = $Result.DefaultSelection<Prisma.$InscriptionPayload>
/**
 * Model Progress
 * 
 */
export type Progress = $Result.DefaultSelection<Prisma.$ProgressPayload>
/**
 * Model Calification
 * 
 */
export type Calification = $Result.DefaultSelection<Prisma.$CalificationPayload>
/**
 * Model Evaluation
 * 
 */
export type Evaluation = $Result.DefaultSelection<Prisma.$EvaluationPayload>
/**
 * Model EvaluationAttempt
 * 
 */
export type EvaluationAttempt = $Result.DefaultSelection<Prisma.$EvaluationAttemptPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Courses
 * const courses = await prisma.course.findMany()
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
   * // Fetch zero or more Courses
   * const courses = await prisma.course.findMany()
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
   * `prisma.course`: Exposes CRUD operations for the **Course** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Courses
    * const courses = await prisma.course.findMany()
    * ```
    */
  get course(): Prisma.CourseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lesson`: Exposes CRUD operations for the **Lesson** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lessons
    * const lessons = await prisma.lesson.findMany()
    * ```
    */
  get lesson(): Prisma.LessonDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inscription`: Exposes CRUD operations for the **Inscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inscriptions
    * const inscriptions = await prisma.inscription.findMany()
    * ```
    */
  get inscription(): Prisma.InscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.progress`: Exposes CRUD operations for the **Progress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Progresses
    * const progresses = await prisma.progress.findMany()
    * ```
    */
  get progress(): Prisma.ProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.calification`: Exposes CRUD operations for the **Calification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Califications
    * const califications = await prisma.calification.findMany()
    * ```
    */
  get calification(): Prisma.CalificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.evaluation`: Exposes CRUD operations for the **Evaluation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Evaluations
    * const evaluations = await prisma.evaluation.findMany()
    * ```
    */
  get evaluation(): Prisma.EvaluationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.evaluationAttempt`: Exposes CRUD operations for the **EvaluationAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EvaluationAttempts
    * const evaluationAttempts = await prisma.evaluationAttempt.findMany()
    * ```
    */
  get evaluationAttempt(): Prisma.EvaluationAttemptDelegate<ExtArgs, ClientOptions>;
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
    Course: 'Course',
    Lesson: 'Lesson',
    Inscription: 'Inscription',
    Progress: 'Progress',
    Calification: 'Calification',
    Evaluation: 'Evaluation',
    EvaluationAttempt: 'EvaluationAttempt'
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
      modelProps: "course" | "lesson" | "inscription" | "progress" | "calification" | "evaluation" | "evaluationAttempt"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Course: {
        payload: Prisma.$CoursePayload<ExtArgs>
        fields: Prisma.CourseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findFirst: {
            args: Prisma.CourseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findMany: {
            args: Prisma.CourseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          create: {
            args: Prisma.CourseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          createMany: {
            args: Prisma.CourseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          delete: {
            args: Prisma.CourseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          update: {
            args: Prisma.CourseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          deleteMany: {
            args: Prisma.CourseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          upsert: {
            args: Prisma.CourseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          aggregate: {
            args: Prisma.CourseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourse>
          }
          groupBy: {
            args: Prisma.CourseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseCountArgs<ExtArgs>
            result: $Utils.Optional<CourseCountAggregateOutputType> | number
          }
        }
      }
      Lesson: {
        payload: Prisma.$LessonPayload<ExtArgs>
        fields: Prisma.LessonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LessonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LessonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          findFirst: {
            args: Prisma.LessonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LessonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          findMany: {
            args: Prisma.LessonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          create: {
            args: Prisma.LessonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          createMany: {
            args: Prisma.LessonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LessonCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          delete: {
            args: Prisma.LessonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          update: {
            args: Prisma.LessonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          deleteMany: {
            args: Prisma.LessonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LessonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LessonUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          upsert: {
            args: Prisma.LessonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          aggregate: {
            args: Prisma.LessonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLesson>
          }
          groupBy: {
            args: Prisma.LessonGroupByArgs<ExtArgs>
            result: $Utils.Optional<LessonGroupByOutputType>[]
          }
          count: {
            args: Prisma.LessonCountArgs<ExtArgs>
            result: $Utils.Optional<LessonCountAggregateOutputType> | number
          }
        }
      }
      Inscription: {
        payload: Prisma.$InscriptionPayload<ExtArgs>
        fields: Prisma.InscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>
          }
          findFirst: {
            args: Prisma.InscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>
          }
          findMany: {
            args: Prisma.InscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>[]
          }
          create: {
            args: Prisma.InscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>
          }
          createMany: {
            args: Prisma.InscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>[]
          }
          delete: {
            args: Prisma.InscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>
          }
          update: {
            args: Prisma.InscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>
          }
          deleteMany: {
            args: Prisma.InscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>[]
          }
          upsert: {
            args: Prisma.InscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InscriptionPayload>
          }
          aggregate: {
            args: Prisma.InscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInscription>
          }
          groupBy: {
            args: Prisma.InscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<InscriptionCountAggregateOutputType> | number
          }
        }
      }
      Progress: {
        payload: Prisma.$ProgressPayload<ExtArgs>
        fields: Prisma.ProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          findFirst: {
            args: Prisma.ProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          findMany: {
            args: Prisma.ProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          create: {
            args: Prisma.ProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          createMany: {
            args: Prisma.ProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          delete: {
            args: Prisma.ProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          update: {
            args: Prisma.ProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          deleteMany: {
            args: Prisma.ProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          upsert: {
            args: Prisma.ProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          aggregate: {
            args: Prisma.ProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgress>
          }
          groupBy: {
            args: Prisma.ProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ProgressCountAggregateOutputType> | number
          }
        }
      }
      Calification: {
        payload: Prisma.$CalificationPayload<ExtArgs>
        fields: Prisma.CalificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CalificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CalificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>
          }
          findFirst: {
            args: Prisma.CalificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CalificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>
          }
          findMany: {
            args: Prisma.CalificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>[]
          }
          create: {
            args: Prisma.CalificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>
          }
          createMany: {
            args: Prisma.CalificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CalificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>[]
          }
          delete: {
            args: Prisma.CalificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>
          }
          update: {
            args: Prisma.CalificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>
          }
          deleteMany: {
            args: Prisma.CalificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CalificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CalificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>[]
          }
          upsert: {
            args: Prisma.CalificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificationPayload>
          }
          aggregate: {
            args: Prisma.CalificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCalification>
          }
          groupBy: {
            args: Prisma.CalificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<CalificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.CalificationCountArgs<ExtArgs>
            result: $Utils.Optional<CalificationCountAggregateOutputType> | number
          }
        }
      }
      Evaluation: {
        payload: Prisma.$EvaluationPayload<ExtArgs>
        fields: Prisma.EvaluationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EvaluationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EvaluationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>
          }
          findFirst: {
            args: Prisma.EvaluationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EvaluationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>
          }
          findMany: {
            args: Prisma.EvaluationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>[]
          }
          create: {
            args: Prisma.EvaluationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>
          }
          createMany: {
            args: Prisma.EvaluationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EvaluationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>[]
          }
          delete: {
            args: Prisma.EvaluationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>
          }
          update: {
            args: Prisma.EvaluationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>
          }
          deleteMany: {
            args: Prisma.EvaluationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EvaluationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EvaluationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>[]
          }
          upsert: {
            args: Prisma.EvaluationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationPayload>
          }
          aggregate: {
            args: Prisma.EvaluationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvaluation>
          }
          groupBy: {
            args: Prisma.EvaluationGroupByArgs<ExtArgs>
            result: $Utils.Optional<EvaluationGroupByOutputType>[]
          }
          count: {
            args: Prisma.EvaluationCountArgs<ExtArgs>
            result: $Utils.Optional<EvaluationCountAggregateOutputType> | number
          }
        }
      }
      EvaluationAttempt: {
        payload: Prisma.$EvaluationAttemptPayload<ExtArgs>
        fields: Prisma.EvaluationAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EvaluationAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EvaluationAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>
          }
          findFirst: {
            args: Prisma.EvaluationAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EvaluationAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>
          }
          findMany: {
            args: Prisma.EvaluationAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>[]
          }
          create: {
            args: Prisma.EvaluationAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>
          }
          createMany: {
            args: Prisma.EvaluationAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EvaluationAttemptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>[]
          }
          delete: {
            args: Prisma.EvaluationAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>
          }
          update: {
            args: Prisma.EvaluationAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>
          }
          deleteMany: {
            args: Prisma.EvaluationAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EvaluationAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EvaluationAttemptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>[]
          }
          upsert: {
            args: Prisma.EvaluationAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationAttemptPayload>
          }
          aggregate: {
            args: Prisma.EvaluationAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvaluationAttempt>
          }
          groupBy: {
            args: Prisma.EvaluationAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<EvaluationAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.EvaluationAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<EvaluationAttemptCountAggregateOutputType> | number
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
    course?: CourseOmit
    lesson?: LessonOmit
    inscription?: InscriptionOmit
    progress?: ProgressOmit
    calification?: CalificationOmit
    evaluation?: EvaluationOmit
    evaluationAttempt?: EvaluationAttemptOmit
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
   * Count Type CourseCountOutputType
   */

  export type CourseCountOutputType = {
    lessons: number
    inscriptions: number
    evaluations: number
  }

  export type CourseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | CourseCountOutputTypeCountLessonsArgs
    inscriptions?: boolean | CourseCountOutputTypeCountInscriptionsArgs
    evaluations?: boolean | CourseCountOutputTypeCountEvaluationsArgs
  }

  // Custom InputTypes
  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseCountOutputType
     */
    select?: CourseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountLessonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonWhereInput
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountInscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InscriptionWhereInput
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountEvaluationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvaluationWhereInput
  }


  /**
   * Count Type LessonCountOutputType
   */

  export type LessonCountOutputType = {
    califications: number
  }

  export type LessonCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    califications?: boolean | LessonCountOutputTypeCountCalificationsArgs
  }

  // Custom InputTypes
  /**
   * LessonCountOutputType without action
   */
  export type LessonCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonCountOutputType
     */
    select?: LessonCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LessonCountOutputType without action
   */
  export type LessonCountOutputTypeCountCalificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalificationWhereInput
  }


  /**
   * Count Type InscriptionCountOutputType
   */

  export type InscriptionCountOutputType = {
    progress: number
  }

  export type InscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | InscriptionCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * InscriptionCountOutputType without action
   */
  export type InscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InscriptionCountOutputType
     */
    select?: InscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InscriptionCountOutputType without action
   */
  export type InscriptionCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgressWhereInput
  }


  /**
   * Count Type EvaluationCountOutputType
   */

  export type EvaluationCountOutputType = {
    attempts: number
  }

  export type EvaluationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attempts?: boolean | EvaluationCountOutputTypeCountAttemptsArgs
  }

  // Custom InputTypes
  /**
   * EvaluationCountOutputType without action
   */
  export type EvaluationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationCountOutputType
     */
    select?: EvaluationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EvaluationCountOutputType without action
   */
  export type EvaluationCountOutputTypeCountAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvaluationAttemptWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Course
   */

  export type AggregateCourse = {
    _count: CourseCountAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  export type CourseMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    description: string | null
    status: string | null
    level: string | null
  }

  export type CourseMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    description: string | null
    status: string | null
    level: string | null
  }

  export type CourseCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    title: number
    description: number
    status: number
    level: number
    _all: number
  }


  export type CourseMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    description?: true
    status?: true
    level?: true
  }

  export type CourseMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    description?: true
    status?: true
    level?: true
  }

  export type CourseCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    description?: true
    status?: true
    level?: true
    _all?: true
  }

  export type CourseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Course to aggregate.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Courses
    **/
    _count?: true | CourseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseMaxAggregateInputType
  }

  export type GetCourseAggregateType<T extends CourseAggregateArgs> = {
        [P in keyof T & keyof AggregateCourse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourse[P]>
      : GetScalarType<T[P], AggregateCourse[P]>
  }




  export type CourseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseWhereInput
    orderBy?: CourseOrderByWithAggregationInput | CourseOrderByWithAggregationInput[]
    by: CourseScalarFieldEnum[] | CourseScalarFieldEnum
    having?: CourseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseCountAggregateInputType | true
    _min?: CourseMinAggregateInputType
    _max?: CourseMaxAggregateInputType
  }

  export type CourseGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    title: string
    description: string
    status: string
    level: string
    _count: CourseCountAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  type GetCourseGroupByPayload<T extends CourseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseGroupByOutputType[P]>
            : GetScalarType<T[P], CourseGroupByOutputType[P]>
        }
      >
    >


  export type CourseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    level?: boolean
    lessons?: boolean | Course$lessonsArgs<ExtArgs>
    inscriptions?: boolean | Course$inscriptionsArgs<ExtArgs>
    evaluations?: boolean | Course$evaluationsArgs<ExtArgs>
    _count?: boolean | CourseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["course"]>

  export type CourseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    level?: boolean
  }, ExtArgs["result"]["course"]>

  export type CourseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    level?: boolean
  }, ExtArgs["result"]["course"]>

  export type CourseSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    level?: boolean
  }

  export type CourseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "title" | "description" | "status" | "level", ExtArgs["result"]["course"]>
  export type CourseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | Course$lessonsArgs<ExtArgs>
    inscriptions?: boolean | Course$inscriptionsArgs<ExtArgs>
    evaluations?: boolean | Course$evaluationsArgs<ExtArgs>
    _count?: boolean | CourseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CourseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CourseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CoursePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Course"
    objects: {
      lessons: Prisma.$LessonPayload<ExtArgs>[]
      inscriptions: Prisma.$InscriptionPayload<ExtArgs>[]
      evaluations: Prisma.$EvaluationPayload<ExtArgs>[]
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
      title: string
      description: string
      status: string
      level: string
    }, ExtArgs["result"]["course"]>
    composites: {}
  }

  type CourseGetPayload<S extends boolean | null | undefined | CourseDefaultArgs> = $Result.GetResult<Prisma.$CoursePayload, S>

  type CourseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourseCountAggregateInputType | true
    }

  export interface CourseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Course'], meta: { name: 'Course' } }
    /**
     * Find zero or one Course that matches the filter.
     * @param {CourseFindUniqueArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseFindUniqueArgs>(args: SelectSubset<T, CourseFindUniqueArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Course that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseFindUniqueOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseFindFirstArgs>(args?: SelectSubset<T, CourseFindFirstArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Courses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Courses
     * const courses = await prisma.course.findMany()
     * 
     * // Get first 10 Courses
     * const courses = await prisma.course.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courseWithIdOnly = await prisma.course.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourseFindManyArgs>(args?: SelectSubset<T, CourseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Course.
     * @param {CourseCreateArgs} args - Arguments to create a Course.
     * @example
     * // Create one Course
     * const Course = await prisma.course.create({
     *   data: {
     *     // ... data to create a Course
     *   }
     * })
     * 
     */
    create<T extends CourseCreateArgs>(args: SelectSubset<T, CourseCreateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Courses.
     * @param {CourseCreateManyArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseCreateManyArgs>(args?: SelectSubset<T, CourseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Courses and returns the data saved in the database.
     * @param {CourseCreateManyAndReturnArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Courses and only return the `id`
     * const courseWithIdOnly = await prisma.course.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Course.
     * @param {CourseDeleteArgs} args - Arguments to delete one Course.
     * @example
     * // Delete one Course
     * const Course = await prisma.course.delete({
     *   where: {
     *     // ... filter to delete one Course
     *   }
     * })
     * 
     */
    delete<T extends CourseDeleteArgs>(args: SelectSubset<T, CourseDeleteArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Course.
     * @param {CourseUpdateArgs} args - Arguments to update one Course.
     * @example
     * // Update one Course
     * const course = await prisma.course.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseUpdateArgs>(args: SelectSubset<T, CourseUpdateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Courses.
     * @param {CourseDeleteManyArgs} args - Arguments to filter Courses to delete.
     * @example
     * // Delete a few Courses
     * const { count } = await prisma.course.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseDeleteManyArgs>(args?: SelectSubset<T, CourseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Courses
     * const course = await prisma.course.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseUpdateManyArgs>(args: SelectSubset<T, CourseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses and returns the data updated in the database.
     * @param {CourseUpdateManyAndReturnArgs} args - Arguments to update many Courses.
     * @example
     * // Update many Courses
     * const course = await prisma.course.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Courses and only return the `id`
     * const courseWithIdOnly = await prisma.course.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourseUpdateManyAndReturnArgs>(args: SelectSubset<T, CourseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Course.
     * @param {CourseUpsertArgs} args - Arguments to update or create a Course.
     * @example
     * // Update or create a Course
     * const course = await prisma.course.upsert({
     *   create: {
     *     // ... data to create a Course
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Course we want to update
     *   }
     * })
     */
    upsert<T extends CourseUpsertArgs>(args: SelectSubset<T, CourseUpsertArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseCountArgs} args - Arguments to filter Courses to count.
     * @example
     * // Count the number of Courses
     * const count = await prisma.course.count({
     *   where: {
     *     // ... the filter for the Courses we want to count
     *   }
     * })
    **/
    count<T extends CourseCountArgs>(
      args?: Subset<T, CourseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseAggregateArgs>(args: Subset<T, CourseAggregateArgs>): Prisma.PrismaPromise<GetCourseAggregateType<T>>

    /**
     * Group by Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseGroupByArgs} args - Group by arguments.
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
      T extends CourseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseGroupByArgs['orderBy'] }
        : { orderBy?: CourseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Course model
   */
  readonly fields: CourseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Course.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lessons<T extends Course$lessonsArgs<ExtArgs> = {}>(args?: Subset<T, Course$lessonsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inscriptions<T extends Course$inscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Course$inscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    evaluations<T extends Course$evaluationsArgs<ExtArgs> = {}>(args?: Subset<T, Course$evaluationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Course model
   */
  interface CourseFieldRefs {
    readonly id: FieldRef<"Course", 'String'>
    readonly transactionDate: FieldRef<"Course", 'DateTime'>
    readonly startDate: FieldRef<"Course", 'DateTime'>
    readonly endDate: FieldRef<"Course", 'DateTime'>
    readonly createdBy: FieldRef<"Course", 'String'>
    readonly updatedBy: FieldRef<"Course", 'String'>
    readonly createdAt: FieldRef<"Course", 'DateTime'>
    readonly updatedAt: FieldRef<"Course", 'DateTime'>
    readonly title: FieldRef<"Course", 'String'>
    readonly description: FieldRef<"Course", 'String'>
    readonly status: FieldRef<"Course", 'String'>
    readonly level: FieldRef<"Course", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Course findUnique
   */
  export type CourseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findUniqueOrThrow
   */
  export type CourseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findFirst
   */
  export type CourseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findFirstOrThrow
   */
  export type CourseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findMany
   */
  export type CourseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Courses to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course create
   */
  export type CourseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The data needed to create a Course.
     */
    data: XOR<CourseCreateInput, CourseUncheckedCreateInput>
  }

  /**
   * Course createMany
   */
  export type CourseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Course createManyAndReturn
   */
  export type CourseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Course update
   */
  export type CourseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The data needed to update a Course.
     */
    data: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
    /**
     * Choose, which Course to update.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course updateMany
   */
  export type CourseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Courses.
     */
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyInput>
    /**
     * Filter which Courses to update
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to update.
     */
    limit?: number
  }

  /**
   * Course updateManyAndReturn
   */
  export type CourseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data used to update Courses.
     */
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyInput>
    /**
     * Filter which Courses to update
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to update.
     */
    limit?: number
  }

  /**
   * Course upsert
   */
  export type CourseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The filter to search for the Course to update in case it exists.
     */
    where: CourseWhereUniqueInput
    /**
     * In case the Course found by the `where` argument doesn't exist, create a new Course with this data.
     */
    create: XOR<CourseCreateInput, CourseUncheckedCreateInput>
    /**
     * In case the Course was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
  }

  /**
   * Course delete
   */
  export type CourseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter which Course to delete.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course deleteMany
   */
  export type CourseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Courses to delete
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to delete.
     */
    limit?: number
  }

  /**
   * Course.lessons
   */
  export type Course$lessonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    where?: LessonWhereInput
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    cursor?: LessonWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Course.inscriptions
   */
  export type Course$inscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    where?: InscriptionWhereInput
    orderBy?: InscriptionOrderByWithRelationInput | InscriptionOrderByWithRelationInput[]
    cursor?: InscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InscriptionScalarFieldEnum | InscriptionScalarFieldEnum[]
  }

  /**
   * Course.evaluations
   */
  export type Course$evaluationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    where?: EvaluationWhereInput
    orderBy?: EvaluationOrderByWithRelationInput | EvaluationOrderByWithRelationInput[]
    cursor?: EvaluationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EvaluationScalarFieldEnum | EvaluationScalarFieldEnum[]
  }

  /**
   * Course without action
   */
  export type CourseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
  }


  /**
   * Model Lesson
   */

  export type AggregateLesson = {
    _count: LessonCountAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  export type LessonMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    content: string | null
    contentType: string | null
    courseId: string | null
  }

  export type LessonMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    content: string | null
    contentType: string | null
    courseId: string | null
  }

  export type LessonCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    title: number
    content: number
    contentType: number
    courseId: number
    _all: number
  }


  export type LessonMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    content?: true
    contentType?: true
    courseId?: true
  }

  export type LessonMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    content?: true
    contentType?: true
    courseId?: true
  }

  export type LessonCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    content?: true
    contentType?: true
    courseId?: true
    _all?: true
  }

  export type LessonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lesson to aggregate.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lessons
    **/
    _count?: true | LessonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonMaxAggregateInputType
  }

  export type GetLessonAggregateType<T extends LessonAggregateArgs> = {
        [P in keyof T & keyof AggregateLesson]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLesson[P]>
      : GetScalarType<T[P], AggregateLesson[P]>
  }




  export type LessonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonWhereInput
    orderBy?: LessonOrderByWithAggregationInput | LessonOrderByWithAggregationInput[]
    by: LessonScalarFieldEnum[] | LessonScalarFieldEnum
    having?: LessonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonCountAggregateInputType | true
    _min?: LessonMinAggregateInputType
    _max?: LessonMaxAggregateInputType
  }

  export type LessonGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    title: string
    content: string
    contentType: string
    courseId: string
    _count: LessonCountAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  type GetLessonGroupByPayload<T extends LessonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LessonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonGroupByOutputType[P]>
            : GetScalarType<T[P], LessonGroupByOutputType[P]>
        }
      >
    >


  export type LessonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    contentType?: boolean
    courseId?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
    califications?: boolean | Lesson$calificationsArgs<ExtArgs>
    _count?: boolean | LessonCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    contentType?: boolean
    courseId?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    contentType?: boolean
    courseId?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    contentType?: boolean
    courseId?: boolean
  }

  export type LessonOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "title" | "content" | "contentType" | "courseId", ExtArgs["result"]["lesson"]>
  export type LessonInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
    califications?: boolean | Lesson$calificationsArgs<ExtArgs>
    _count?: boolean | LessonCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LessonIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type LessonIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $LessonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lesson"
    objects: {
      course: Prisma.$CoursePayload<ExtArgs>
      califications: Prisma.$CalificationPayload<ExtArgs>[]
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
      title: string
      content: string
      contentType: string
      courseId: string
    }, ExtArgs["result"]["lesson"]>
    composites: {}
  }

  type LessonGetPayload<S extends boolean | null | undefined | LessonDefaultArgs> = $Result.GetResult<Prisma.$LessonPayload, S>

  type LessonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LessonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LessonCountAggregateInputType | true
    }

  export interface LessonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lesson'], meta: { name: 'Lesson' } }
    /**
     * Find zero or one Lesson that matches the filter.
     * @param {LessonFindUniqueArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LessonFindUniqueArgs>(args: SelectSubset<T, LessonFindUniqueArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lesson that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LessonFindUniqueOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LessonFindUniqueOrThrowArgs>(args: SelectSubset<T, LessonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LessonFindFirstArgs>(args?: SelectSubset<T, LessonFindFirstArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LessonFindFirstOrThrowArgs>(args?: SelectSubset<T, LessonFindFirstOrThrowArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lessons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lessons
     * const lessons = await prisma.lesson.findMany()
     * 
     * // Get first 10 Lessons
     * const lessons = await prisma.lesson.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonWithIdOnly = await prisma.lesson.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LessonFindManyArgs>(args?: SelectSubset<T, LessonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lesson.
     * @param {LessonCreateArgs} args - Arguments to create a Lesson.
     * @example
     * // Create one Lesson
     * const Lesson = await prisma.lesson.create({
     *   data: {
     *     // ... data to create a Lesson
     *   }
     * })
     * 
     */
    create<T extends LessonCreateArgs>(args: SelectSubset<T, LessonCreateArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lessons.
     * @param {LessonCreateManyArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lesson = await prisma.lesson.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LessonCreateManyArgs>(args?: SelectSubset<T, LessonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lessons and returns the data saved in the database.
     * @param {LessonCreateManyAndReturnArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lesson = await prisma.lesson.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lessons and only return the `id`
     * const lessonWithIdOnly = await prisma.lesson.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LessonCreateManyAndReturnArgs>(args?: SelectSubset<T, LessonCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lesson.
     * @param {LessonDeleteArgs} args - Arguments to delete one Lesson.
     * @example
     * // Delete one Lesson
     * const Lesson = await prisma.lesson.delete({
     *   where: {
     *     // ... filter to delete one Lesson
     *   }
     * })
     * 
     */
    delete<T extends LessonDeleteArgs>(args: SelectSubset<T, LessonDeleteArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lesson.
     * @param {LessonUpdateArgs} args - Arguments to update one Lesson.
     * @example
     * // Update one Lesson
     * const lesson = await prisma.lesson.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LessonUpdateArgs>(args: SelectSubset<T, LessonUpdateArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lessons.
     * @param {LessonDeleteManyArgs} args - Arguments to filter Lessons to delete.
     * @example
     * // Delete a few Lessons
     * const { count } = await prisma.lesson.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LessonDeleteManyArgs>(args?: SelectSubset<T, LessonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LessonUpdateManyArgs>(args: SelectSubset<T, LessonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons and returns the data updated in the database.
     * @param {LessonUpdateManyAndReturnArgs} args - Arguments to update many Lessons.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lessons and only return the `id`
     * const lessonWithIdOnly = await prisma.lesson.updateManyAndReturn({
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
    updateManyAndReturn<T extends LessonUpdateManyAndReturnArgs>(args: SelectSubset<T, LessonUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lesson.
     * @param {LessonUpsertArgs} args - Arguments to update or create a Lesson.
     * @example
     * // Update or create a Lesson
     * const lesson = await prisma.lesson.upsert({
     *   create: {
     *     // ... data to create a Lesson
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lesson we want to update
     *   }
     * })
     */
    upsert<T extends LessonUpsertArgs>(args: SelectSubset<T, LessonUpsertArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonCountArgs} args - Arguments to filter Lessons to count.
     * @example
     * // Count the number of Lessons
     * const count = await prisma.lesson.count({
     *   where: {
     *     // ... the filter for the Lessons we want to count
     *   }
     * })
    **/
    count<T extends LessonCountArgs>(
      args?: Subset<T, LessonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LessonAggregateArgs>(args: Subset<T, LessonAggregateArgs>): Prisma.PrismaPromise<GetLessonAggregateType<T>>

    /**
     * Group by Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonGroupByArgs} args - Group by arguments.
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
      T extends LessonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LessonGroupByArgs['orderBy'] }
        : { orderBy?: LessonGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LessonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lesson model
   */
  readonly fields: LessonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lesson.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LessonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    course<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    califications<T extends Lesson$calificationsArgs<ExtArgs> = {}>(args?: Subset<T, Lesson$calificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Lesson model
   */
  interface LessonFieldRefs {
    readonly id: FieldRef<"Lesson", 'String'>
    readonly transactionDate: FieldRef<"Lesson", 'DateTime'>
    readonly startDate: FieldRef<"Lesson", 'DateTime'>
    readonly endDate: FieldRef<"Lesson", 'DateTime'>
    readonly createdBy: FieldRef<"Lesson", 'String'>
    readonly updatedBy: FieldRef<"Lesson", 'String'>
    readonly createdAt: FieldRef<"Lesson", 'DateTime'>
    readonly updatedAt: FieldRef<"Lesson", 'DateTime'>
    readonly title: FieldRef<"Lesson", 'String'>
    readonly content: FieldRef<"Lesson", 'String'>
    readonly contentType: FieldRef<"Lesson", 'String'>
    readonly courseId: FieldRef<"Lesson", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Lesson findUnique
   */
  export type LessonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson findUniqueOrThrow
   */
  export type LessonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson findFirst
   */
  export type LessonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson findFirstOrThrow
   */
  export type LessonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson findMany
   */
  export type LessonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lessons to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson create
   */
  export type LessonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to create a Lesson.
     */
    data: XOR<LessonCreateInput, LessonUncheckedCreateInput>
  }

  /**
   * Lesson createMany
   */
  export type LessonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lessons.
     */
    data: LessonCreateManyInput | LessonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lesson createManyAndReturn
   */
  export type LessonCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * The data used to create many Lessons.
     */
    data: LessonCreateManyInput | LessonCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lesson update
   */
  export type LessonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to update a Lesson.
     */
    data: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
    /**
     * Choose, which Lesson to update.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson updateMany
   */
  export type LessonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lessons.
     */
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyInput>
    /**
     * Filter which Lessons to update
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to update.
     */
    limit?: number
  }

  /**
   * Lesson updateManyAndReturn
   */
  export type LessonUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * The data used to update Lessons.
     */
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyInput>
    /**
     * Filter which Lessons to update
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lesson upsert
   */
  export type LessonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The filter to search for the Lesson to update in case it exists.
     */
    where: LessonWhereUniqueInput
    /**
     * In case the Lesson found by the `where` argument doesn't exist, create a new Lesson with this data.
     */
    create: XOR<LessonCreateInput, LessonUncheckedCreateInput>
    /**
     * In case the Lesson was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
  }

  /**
   * Lesson delete
   */
  export type LessonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter which Lesson to delete.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson deleteMany
   */
  export type LessonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lessons to delete
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to delete.
     */
    limit?: number
  }

  /**
   * Lesson.califications
   */
  export type Lesson$calificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    where?: CalificationWhereInput
    orderBy?: CalificationOrderByWithRelationInput | CalificationOrderByWithRelationInput[]
    cursor?: CalificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CalificationScalarFieldEnum | CalificationScalarFieldEnum[]
  }

  /**
   * Lesson without action
   */
  export type LessonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
  }


  /**
   * Model Inscription
   */

  export type AggregateInscription = {
    _count: InscriptionCountAggregateOutputType | null
    _avg: InscriptionAvgAggregateOutputType | null
    _sum: InscriptionSumAggregateOutputType | null
    _min: InscriptionMinAggregateOutputType | null
    _max: InscriptionMaxAggregateOutputType | null
  }

  export type InscriptionAvgAggregateOutputType = {
    progressPercentage: Decimal | null
  }

  export type InscriptionSumAggregateOutputType = {
    progressPercentage: Decimal | null
  }

  export type InscriptionMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
    status: string | null
    progressPercentage: Decimal | null
    completedAt: Date | null
  }

  export type InscriptionMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
    status: string | null
    progressPercentage: Decimal | null
    completedAt: Date | null
  }

  export type InscriptionCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    userId: number
    courseId: number
    status: number
    progressPercentage: number
    completedAt: number
    _all: number
  }


  export type InscriptionAvgAggregateInputType = {
    progressPercentage?: true
  }

  export type InscriptionSumAggregateInputType = {
    progressPercentage?: true
  }

  export type InscriptionMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
    status?: true
    progressPercentage?: true
    completedAt?: true
  }

  export type InscriptionMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
    status?: true
    progressPercentage?: true
    completedAt?: true
  }

  export type InscriptionCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
    status?: true
    progressPercentage?: true
    completedAt?: true
    _all?: true
  }

  export type InscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inscription to aggregate.
     */
    where?: InscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inscriptions to fetch.
     */
    orderBy?: InscriptionOrderByWithRelationInput | InscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inscriptions
    **/
    _count?: true | InscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InscriptionMaxAggregateInputType
  }

  export type GetInscriptionAggregateType<T extends InscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateInscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInscription[P]>
      : GetScalarType<T[P], AggregateInscription[P]>
  }




  export type InscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InscriptionWhereInput
    orderBy?: InscriptionOrderByWithAggregationInput | InscriptionOrderByWithAggregationInput[]
    by: InscriptionScalarFieldEnum[] | InscriptionScalarFieldEnum
    having?: InscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InscriptionCountAggregateInputType | true
    _avg?: InscriptionAvgAggregateInputType
    _sum?: InscriptionSumAggregateInputType
    _min?: InscriptionMinAggregateInputType
    _max?: InscriptionMaxAggregateInputType
  }

  export type InscriptionGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    courseId: string
    status: string
    progressPercentage: Decimal | null
    completedAt: Date | null
    _count: InscriptionCountAggregateOutputType | null
    _avg: InscriptionAvgAggregateOutputType | null
    _sum: InscriptionSumAggregateOutputType | null
    _min: InscriptionMinAggregateOutputType | null
    _max: InscriptionMaxAggregateOutputType | null
  }

  type GetInscriptionGroupByPayload<T extends InscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], InscriptionGroupByOutputType[P]>
        }
      >
    >


  export type InscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    status?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
    progress?: boolean | Inscription$progressArgs<ExtArgs>
    _count?: boolean | InscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inscription"]>

  export type InscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    status?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inscription"]>

  export type InscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    status?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inscription"]>

  export type InscriptionSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    status?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
  }

  export type InscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "userId" | "courseId" | "status" | "progressPercentage" | "completedAt", ExtArgs["result"]["inscription"]>
  export type InscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
    progress?: boolean | Inscription$progressArgs<ExtArgs>
    _count?: boolean | InscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type InscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $InscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inscription"
    objects: {
      course: Prisma.$CoursePayload<ExtArgs>
      progress: Prisma.$ProgressPayload<ExtArgs>[]
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
      courseId: string
      status: string
      progressPercentage: Prisma.Decimal | null
      completedAt: Date | null
    }, ExtArgs["result"]["inscription"]>
    composites: {}
  }

  type InscriptionGetPayload<S extends boolean | null | undefined | InscriptionDefaultArgs> = $Result.GetResult<Prisma.$InscriptionPayload, S>

  type InscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InscriptionCountAggregateInputType | true
    }

  export interface InscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inscription'], meta: { name: 'Inscription' } }
    /**
     * Find zero or one Inscription that matches the filter.
     * @param {InscriptionFindUniqueArgs} args - Arguments to find a Inscription
     * @example
     * // Get one Inscription
     * const inscription = await prisma.inscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InscriptionFindUniqueArgs>(args: SelectSubset<T, InscriptionFindUniqueArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InscriptionFindUniqueOrThrowArgs} args - Arguments to find a Inscription
     * @example
     * // Get one Inscription
     * const inscription = await prisma.inscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, InscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionFindFirstArgs} args - Arguments to find a Inscription
     * @example
     * // Get one Inscription
     * const inscription = await prisma.inscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InscriptionFindFirstArgs>(args?: SelectSubset<T, InscriptionFindFirstArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionFindFirstOrThrowArgs} args - Arguments to find a Inscription
     * @example
     * // Get one Inscription
     * const inscription = await prisma.inscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, InscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inscriptions
     * const inscriptions = await prisma.inscription.findMany()
     * 
     * // Get first 10 Inscriptions
     * const inscriptions = await prisma.inscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inscriptionWithIdOnly = await prisma.inscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InscriptionFindManyArgs>(args?: SelectSubset<T, InscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inscription.
     * @param {InscriptionCreateArgs} args - Arguments to create a Inscription.
     * @example
     * // Create one Inscription
     * const Inscription = await prisma.inscription.create({
     *   data: {
     *     // ... data to create a Inscription
     *   }
     * })
     * 
     */
    create<T extends InscriptionCreateArgs>(args: SelectSubset<T, InscriptionCreateArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inscriptions.
     * @param {InscriptionCreateManyArgs} args - Arguments to create many Inscriptions.
     * @example
     * // Create many Inscriptions
     * const inscription = await prisma.inscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InscriptionCreateManyArgs>(args?: SelectSubset<T, InscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inscriptions and returns the data saved in the database.
     * @param {InscriptionCreateManyAndReturnArgs} args - Arguments to create many Inscriptions.
     * @example
     * // Create many Inscriptions
     * const inscription = await prisma.inscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inscriptions and only return the `id`
     * const inscriptionWithIdOnly = await prisma.inscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, InscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inscription.
     * @param {InscriptionDeleteArgs} args - Arguments to delete one Inscription.
     * @example
     * // Delete one Inscription
     * const Inscription = await prisma.inscription.delete({
     *   where: {
     *     // ... filter to delete one Inscription
     *   }
     * })
     * 
     */
    delete<T extends InscriptionDeleteArgs>(args: SelectSubset<T, InscriptionDeleteArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inscription.
     * @param {InscriptionUpdateArgs} args - Arguments to update one Inscription.
     * @example
     * // Update one Inscription
     * const inscription = await prisma.inscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InscriptionUpdateArgs>(args: SelectSubset<T, InscriptionUpdateArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inscriptions.
     * @param {InscriptionDeleteManyArgs} args - Arguments to filter Inscriptions to delete.
     * @example
     * // Delete a few Inscriptions
     * const { count } = await prisma.inscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InscriptionDeleteManyArgs>(args?: SelectSubset<T, InscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inscriptions
     * const inscription = await prisma.inscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InscriptionUpdateManyArgs>(args: SelectSubset<T, InscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inscriptions and returns the data updated in the database.
     * @param {InscriptionUpdateManyAndReturnArgs} args - Arguments to update many Inscriptions.
     * @example
     * // Update many Inscriptions
     * const inscription = await prisma.inscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inscriptions and only return the `id`
     * const inscriptionWithIdOnly = await prisma.inscription.updateManyAndReturn({
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
    updateManyAndReturn<T extends InscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, InscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inscription.
     * @param {InscriptionUpsertArgs} args - Arguments to update or create a Inscription.
     * @example
     * // Update or create a Inscription
     * const inscription = await prisma.inscription.upsert({
     *   create: {
     *     // ... data to create a Inscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inscription we want to update
     *   }
     * })
     */
    upsert<T extends InscriptionUpsertArgs>(args: SelectSubset<T, InscriptionUpsertArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionCountArgs} args - Arguments to filter Inscriptions to count.
     * @example
     * // Count the number of Inscriptions
     * const count = await prisma.inscription.count({
     *   where: {
     *     // ... the filter for the Inscriptions we want to count
     *   }
     * })
    **/
    count<T extends InscriptionCountArgs>(
      args?: Subset<T, InscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InscriptionAggregateArgs>(args: Subset<T, InscriptionAggregateArgs>): Prisma.PrismaPromise<GetInscriptionAggregateType<T>>

    /**
     * Group by Inscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InscriptionGroupByArgs} args - Group by arguments.
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
      T extends InscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InscriptionGroupByArgs['orderBy'] }
        : { orderBy?: InscriptionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inscription model
   */
  readonly fields: InscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    course<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    progress<T extends Inscription$progressArgs<ExtArgs> = {}>(args?: Subset<T, Inscription$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Inscription model
   */
  interface InscriptionFieldRefs {
    readonly id: FieldRef<"Inscription", 'String'>
    readonly transactionDate: FieldRef<"Inscription", 'DateTime'>
    readonly startDate: FieldRef<"Inscription", 'DateTime'>
    readonly endDate: FieldRef<"Inscription", 'DateTime'>
    readonly createdBy: FieldRef<"Inscription", 'String'>
    readonly updatedBy: FieldRef<"Inscription", 'String'>
    readonly createdAt: FieldRef<"Inscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Inscription", 'DateTime'>
    readonly userId: FieldRef<"Inscription", 'String'>
    readonly courseId: FieldRef<"Inscription", 'String'>
    readonly status: FieldRef<"Inscription", 'String'>
    readonly progressPercentage: FieldRef<"Inscription", 'Decimal'>
    readonly completedAt: FieldRef<"Inscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inscription findUnique
   */
  export type InscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Inscription to fetch.
     */
    where: InscriptionWhereUniqueInput
  }

  /**
   * Inscription findUniqueOrThrow
   */
  export type InscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Inscription to fetch.
     */
    where: InscriptionWhereUniqueInput
  }

  /**
   * Inscription findFirst
   */
  export type InscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Inscription to fetch.
     */
    where?: InscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inscriptions to fetch.
     */
    orderBy?: InscriptionOrderByWithRelationInput | InscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inscriptions.
     */
    cursor?: InscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inscriptions.
     */
    distinct?: InscriptionScalarFieldEnum | InscriptionScalarFieldEnum[]
  }

  /**
   * Inscription findFirstOrThrow
   */
  export type InscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Inscription to fetch.
     */
    where?: InscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inscriptions to fetch.
     */
    orderBy?: InscriptionOrderByWithRelationInput | InscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inscriptions.
     */
    cursor?: InscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inscriptions.
     */
    distinct?: InscriptionScalarFieldEnum | InscriptionScalarFieldEnum[]
  }

  /**
   * Inscription findMany
   */
  export type InscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Inscriptions to fetch.
     */
    where?: InscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inscriptions to fetch.
     */
    orderBy?: InscriptionOrderByWithRelationInput | InscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inscriptions.
     */
    cursor?: InscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inscriptions.
     */
    skip?: number
    distinct?: InscriptionScalarFieldEnum | InscriptionScalarFieldEnum[]
  }

  /**
   * Inscription create
   */
  export type InscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Inscription.
     */
    data: XOR<InscriptionCreateInput, InscriptionUncheckedCreateInput>
  }

  /**
   * Inscription createMany
   */
  export type InscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inscriptions.
     */
    data: InscriptionCreateManyInput | InscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inscription createManyAndReturn
   */
  export type InscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Inscriptions.
     */
    data: InscriptionCreateManyInput | InscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inscription update
   */
  export type InscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Inscription.
     */
    data: XOR<InscriptionUpdateInput, InscriptionUncheckedUpdateInput>
    /**
     * Choose, which Inscription to update.
     */
    where: InscriptionWhereUniqueInput
  }

  /**
   * Inscription updateMany
   */
  export type InscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inscriptions.
     */
    data: XOR<InscriptionUpdateManyMutationInput, InscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Inscriptions to update
     */
    where?: InscriptionWhereInput
    /**
     * Limit how many Inscriptions to update.
     */
    limit?: number
  }

  /**
   * Inscription updateManyAndReturn
   */
  export type InscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Inscriptions.
     */
    data: XOR<InscriptionUpdateManyMutationInput, InscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Inscriptions to update
     */
    where?: InscriptionWhereInput
    /**
     * Limit how many Inscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inscription upsert
   */
  export type InscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Inscription to update in case it exists.
     */
    where: InscriptionWhereUniqueInput
    /**
     * In case the Inscription found by the `where` argument doesn't exist, create a new Inscription with this data.
     */
    create: XOR<InscriptionCreateInput, InscriptionUncheckedCreateInput>
    /**
     * In case the Inscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InscriptionUpdateInput, InscriptionUncheckedUpdateInput>
  }

  /**
   * Inscription delete
   */
  export type InscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
    /**
     * Filter which Inscription to delete.
     */
    where: InscriptionWhereUniqueInput
  }

  /**
   * Inscription deleteMany
   */
  export type InscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inscriptions to delete
     */
    where?: InscriptionWhereInput
    /**
     * Limit how many Inscriptions to delete.
     */
    limit?: number
  }

  /**
   * Inscription.progress
   */
  export type Inscription$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    where?: ProgressWhereInput
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    cursor?: ProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Inscription without action
   */
  export type InscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inscription
     */
    select?: InscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inscription
     */
    omit?: InscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Progress
   */

  export type AggregateProgress = {
    _count: ProgressCountAggregateOutputType | null
    _avg: ProgressAvgAggregateOutputType | null
    _sum: ProgressSumAggregateOutputType | null
    _min: ProgressMinAggregateOutputType | null
    _max: ProgressMaxAggregateOutputType | null
  }

  export type ProgressAvgAggregateOutputType = {
    lessonsCompleted: Decimal | null
    evaluationsCompleted: Decimal | null
    averageScore: Decimal | null
    progressPercentage: Decimal | null
  }

  export type ProgressSumAggregateOutputType = {
    lessonsCompleted: Decimal | null
    evaluationsCompleted: Decimal | null
    averageScore: Decimal | null
    progressPercentage: Decimal | null
  }

  export type ProgressMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    inscriptionId: string | null
    lessonsCompleted: Decimal | null
    evaluationsCompleted: Decimal | null
    averageScore: Decimal | null
    progressPercentage: Decimal | null
    lastAccessAt: Date | null
  }

  export type ProgressMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    inscriptionId: string | null
    lessonsCompleted: Decimal | null
    evaluationsCompleted: Decimal | null
    averageScore: Decimal | null
    progressPercentage: Decimal | null
    lastAccessAt: Date | null
  }

  export type ProgressCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    inscriptionId: number
    lessonsCompleted: number
    evaluationsCompleted: number
    averageScore: number
    progressPercentage: number
    lastAccessAt: number
    _all: number
  }


  export type ProgressAvgAggregateInputType = {
    lessonsCompleted?: true
    evaluationsCompleted?: true
    averageScore?: true
    progressPercentage?: true
  }

  export type ProgressSumAggregateInputType = {
    lessonsCompleted?: true
    evaluationsCompleted?: true
    averageScore?: true
    progressPercentage?: true
  }

  export type ProgressMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    inscriptionId?: true
    lessonsCompleted?: true
    evaluationsCompleted?: true
    averageScore?: true
    progressPercentage?: true
    lastAccessAt?: true
  }

  export type ProgressMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    inscriptionId?: true
    lessonsCompleted?: true
    evaluationsCompleted?: true
    averageScore?: true
    progressPercentage?: true
    lastAccessAt?: true
  }

  export type ProgressCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    inscriptionId?: true
    lessonsCompleted?: true
    evaluationsCompleted?: true
    averageScore?: true
    progressPercentage?: true
    lastAccessAt?: true
    _all?: true
  }

  export type ProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progress to aggregate.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Progresses
    **/
    _count?: true | ProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgressMaxAggregateInputType
  }

  export type GetProgressAggregateType<T extends ProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgress[P]>
      : GetScalarType<T[P], AggregateProgress[P]>
  }




  export type ProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgressWhereInput
    orderBy?: ProgressOrderByWithAggregationInput | ProgressOrderByWithAggregationInput[]
    by: ProgressScalarFieldEnum[] | ProgressScalarFieldEnum
    having?: ProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgressCountAggregateInputType | true
    _avg?: ProgressAvgAggregateInputType
    _sum?: ProgressSumAggregateInputType
    _min?: ProgressMinAggregateInputType
    _max?: ProgressMaxAggregateInputType
  }

  export type ProgressGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    inscriptionId: string
    lessonsCompleted: Decimal
    evaluationsCompleted: Decimal
    averageScore: Decimal
    progressPercentage: Decimal
    lastAccessAt: Date | null
    _count: ProgressCountAggregateOutputType | null
    _avg: ProgressAvgAggregateOutputType | null
    _sum: ProgressSumAggregateOutputType | null
    _min: ProgressMinAggregateOutputType | null
    _max: ProgressMaxAggregateOutputType | null
  }

  type GetProgressGroupByPayload<T extends ProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ProgressGroupByOutputType[P]>
        }
      >
    >


  export type ProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inscriptionId?: boolean
    lessonsCompleted?: boolean
    evaluationsCompleted?: boolean
    averageScore?: boolean
    progressPercentage?: boolean
    lastAccessAt?: boolean
    inscription?: boolean | InscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inscriptionId?: boolean
    lessonsCompleted?: boolean
    evaluationsCompleted?: boolean
    averageScore?: boolean
    progressPercentage?: boolean
    lastAccessAt?: boolean
    inscription?: boolean | InscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inscriptionId?: boolean
    lessonsCompleted?: boolean
    evaluationsCompleted?: boolean
    averageScore?: boolean
    progressPercentage?: boolean
    lastAccessAt?: boolean
    inscription?: boolean | InscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inscriptionId?: boolean
    lessonsCompleted?: boolean
    evaluationsCompleted?: boolean
    averageScore?: boolean
    progressPercentage?: boolean
    lastAccessAt?: boolean
  }

  export type ProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "inscriptionId" | "lessonsCompleted" | "evaluationsCompleted" | "averageScore" | "progressPercentage" | "lastAccessAt", ExtArgs["result"]["progress"]>
  export type ProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inscription?: boolean | InscriptionDefaultArgs<ExtArgs>
  }
  export type ProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inscription?: boolean | InscriptionDefaultArgs<ExtArgs>
  }
  export type ProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inscription?: boolean | InscriptionDefaultArgs<ExtArgs>
  }

  export type $ProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Progress"
    objects: {
      inscription: Prisma.$InscriptionPayload<ExtArgs>
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
      inscriptionId: string
      lessonsCompleted: Prisma.Decimal
      evaluationsCompleted: Prisma.Decimal
      averageScore: Prisma.Decimal
      progressPercentage: Prisma.Decimal
      lastAccessAt: Date | null
    }, ExtArgs["result"]["progress"]>
    composites: {}
  }

  type ProgressGetPayload<S extends boolean | null | undefined | ProgressDefaultArgs> = $Result.GetResult<Prisma.$ProgressPayload, S>

  type ProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProgressCountAggregateInputType | true
    }

  export interface ProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Progress'], meta: { name: 'Progress' } }
    /**
     * Find zero or one Progress that matches the filter.
     * @param {ProgressFindUniqueArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgressFindUniqueArgs>(args: SelectSubset<T, ProgressFindUniqueArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Progress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgressFindUniqueOrThrowArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Progress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindFirstArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgressFindFirstArgs>(args?: SelectSubset<T, ProgressFindFirstArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Progress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindFirstOrThrowArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Progresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Progresses
     * const progresses = await prisma.progress.findMany()
     * 
     * // Get first 10 Progresses
     * const progresses = await prisma.progress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const progressWithIdOnly = await prisma.progress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgressFindManyArgs>(args?: SelectSubset<T, ProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Progress.
     * @param {ProgressCreateArgs} args - Arguments to create a Progress.
     * @example
     * // Create one Progress
     * const Progress = await prisma.progress.create({
     *   data: {
     *     // ... data to create a Progress
     *   }
     * })
     * 
     */
    create<T extends ProgressCreateArgs>(args: SelectSubset<T, ProgressCreateArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Progresses.
     * @param {ProgressCreateManyArgs} args - Arguments to create many Progresses.
     * @example
     * // Create many Progresses
     * const progress = await prisma.progress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgressCreateManyArgs>(args?: SelectSubset<T, ProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Progresses and returns the data saved in the database.
     * @param {ProgressCreateManyAndReturnArgs} args - Arguments to create many Progresses.
     * @example
     * // Create many Progresses
     * const progress = await prisma.progress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Progresses and only return the `id`
     * const progressWithIdOnly = await prisma.progress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Progress.
     * @param {ProgressDeleteArgs} args - Arguments to delete one Progress.
     * @example
     * // Delete one Progress
     * const Progress = await prisma.progress.delete({
     *   where: {
     *     // ... filter to delete one Progress
     *   }
     * })
     * 
     */
    delete<T extends ProgressDeleteArgs>(args: SelectSubset<T, ProgressDeleteArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Progress.
     * @param {ProgressUpdateArgs} args - Arguments to update one Progress.
     * @example
     * // Update one Progress
     * const progress = await prisma.progress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgressUpdateArgs>(args: SelectSubset<T, ProgressUpdateArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Progresses.
     * @param {ProgressDeleteManyArgs} args - Arguments to filter Progresses to delete.
     * @example
     * // Delete a few Progresses
     * const { count } = await prisma.progress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgressDeleteManyArgs>(args?: SelectSubset<T, ProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Progresses
     * const progress = await prisma.progress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgressUpdateManyArgs>(args: SelectSubset<T, ProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Progresses and returns the data updated in the database.
     * @param {ProgressUpdateManyAndReturnArgs} args - Arguments to update many Progresses.
     * @example
     * // Update many Progresses
     * const progress = await prisma.progress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Progresses and only return the `id`
     * const progressWithIdOnly = await prisma.progress.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Progress.
     * @param {ProgressUpsertArgs} args - Arguments to update or create a Progress.
     * @example
     * // Update or create a Progress
     * const progress = await prisma.progress.upsert({
     *   create: {
     *     // ... data to create a Progress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Progress we want to update
     *   }
     * })
     */
    upsert<T extends ProgressUpsertArgs>(args: SelectSubset<T, ProgressUpsertArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressCountArgs} args - Arguments to filter Progresses to count.
     * @example
     * // Count the number of Progresses
     * const count = await prisma.progress.count({
     *   where: {
     *     // ... the filter for the Progresses we want to count
     *   }
     * })
    **/
    count<T extends ProgressCountArgs>(
      args?: Subset<T, ProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProgressAggregateArgs>(args: Subset<T, ProgressAggregateArgs>): Prisma.PrismaPromise<GetProgressAggregateType<T>>

    /**
     * Group by Progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressGroupByArgs} args - Group by arguments.
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
      T extends ProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgressGroupByArgs['orderBy'] }
        : { orderBy?: ProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Progress model
   */
  readonly fields: ProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Progress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inscription<T extends InscriptionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InscriptionDefaultArgs<ExtArgs>>): Prisma__InscriptionClient<$Result.GetResult<Prisma.$InscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Progress model
   */
  interface ProgressFieldRefs {
    readonly id: FieldRef<"Progress", 'String'>
    readonly transactionDate: FieldRef<"Progress", 'DateTime'>
    readonly startDate: FieldRef<"Progress", 'DateTime'>
    readonly endDate: FieldRef<"Progress", 'DateTime'>
    readonly createdBy: FieldRef<"Progress", 'String'>
    readonly updatedBy: FieldRef<"Progress", 'String'>
    readonly createdAt: FieldRef<"Progress", 'DateTime'>
    readonly updatedAt: FieldRef<"Progress", 'DateTime'>
    readonly inscriptionId: FieldRef<"Progress", 'String'>
    readonly lessonsCompleted: FieldRef<"Progress", 'Decimal'>
    readonly evaluationsCompleted: FieldRef<"Progress", 'Decimal'>
    readonly averageScore: FieldRef<"Progress", 'Decimal'>
    readonly progressPercentage: FieldRef<"Progress", 'Decimal'>
    readonly lastAccessAt: FieldRef<"Progress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Progress findUnique
   */
  export type ProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress findUniqueOrThrow
   */
  export type ProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress findFirst
   */
  export type ProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progresses.
     */
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress findFirstOrThrow
   */
  export type ProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progresses.
     */
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress findMany
   */
  export type ProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progresses to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress create
   */
  export type ProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a Progress.
     */
    data: XOR<ProgressCreateInput, ProgressUncheckedCreateInput>
  }

  /**
   * Progress createMany
   */
  export type ProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Progresses.
     */
    data: ProgressCreateManyInput | ProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Progress createManyAndReturn
   */
  export type ProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * The data used to create many Progresses.
     */
    data: ProgressCreateManyInput | ProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Progress update
   */
  export type ProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a Progress.
     */
    data: XOR<ProgressUpdateInput, ProgressUncheckedUpdateInput>
    /**
     * Choose, which Progress to update.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress updateMany
   */
  export type ProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Progresses.
     */
    data: XOR<ProgressUpdateManyMutationInput, ProgressUncheckedUpdateManyInput>
    /**
     * Filter which Progresses to update
     */
    where?: ProgressWhereInput
    /**
     * Limit how many Progresses to update.
     */
    limit?: number
  }

  /**
   * Progress updateManyAndReturn
   */
  export type ProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * The data used to update Progresses.
     */
    data: XOR<ProgressUpdateManyMutationInput, ProgressUncheckedUpdateManyInput>
    /**
     * Filter which Progresses to update
     */
    where?: ProgressWhereInput
    /**
     * Limit how many Progresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Progress upsert
   */
  export type ProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the Progress to update in case it exists.
     */
    where: ProgressWhereUniqueInput
    /**
     * In case the Progress found by the `where` argument doesn't exist, create a new Progress with this data.
     */
    create: XOR<ProgressCreateInput, ProgressUncheckedCreateInput>
    /**
     * In case the Progress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgressUpdateInput, ProgressUncheckedUpdateInput>
  }

  /**
   * Progress delete
   */
  export type ProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter which Progress to delete.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress deleteMany
   */
  export type ProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progresses to delete
     */
    where?: ProgressWhereInput
    /**
     * Limit how many Progresses to delete.
     */
    limit?: number
  }

  /**
   * Progress without action
   */
  export type ProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Progress
     */
    omit?: ProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
  }


  /**
   * Model Calification
   */

  export type AggregateCalification = {
    _count: CalificationCountAggregateOutputType | null
    _avg: CalificationAvgAggregateOutputType | null
    _sum: CalificationSumAggregateOutputType | null
    _min: CalificationMinAggregateOutputType | null
    _max: CalificationMaxAggregateOutputType | null
  }

  export type CalificationAvgAggregateOutputType = {
    totalPoints: number | null
    maxAttempts: number | null
  }

  export type CalificationSumAggregateOutputType = {
    totalPoints: number | null
    maxAttempts: number | null
  }

  export type CalificationMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    content: string | null
    type: string | null
    totalPoints: number | null
    maxAttempts: number | null
    lessonId: string | null
  }

  export type CalificationMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    content: string | null
    type: string | null
    totalPoints: number | null
    maxAttempts: number | null
    lessonId: string | null
  }

  export type CalificationCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    title: number
    content: number
    type: number
    totalPoints: number
    maxAttempts: number
    lessonId: number
    _all: number
  }


  export type CalificationAvgAggregateInputType = {
    totalPoints?: true
    maxAttempts?: true
  }

  export type CalificationSumAggregateInputType = {
    totalPoints?: true
    maxAttempts?: true
  }

  export type CalificationMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    content?: true
    type?: true
    totalPoints?: true
    maxAttempts?: true
    lessonId?: true
  }

  export type CalificationMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    content?: true
    type?: true
    totalPoints?: true
    maxAttempts?: true
    lessonId?: true
  }

  export type CalificationCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    content?: true
    type?: true
    totalPoints?: true
    maxAttempts?: true
    lessonId?: true
    _all?: true
  }

  export type CalificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Calification to aggregate.
     */
    where?: CalificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Califications to fetch.
     */
    orderBy?: CalificationOrderByWithRelationInput | CalificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CalificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Califications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Califications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Califications
    **/
    _count?: true | CalificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CalificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CalificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CalificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CalificationMaxAggregateInputType
  }

  export type GetCalificationAggregateType<T extends CalificationAggregateArgs> = {
        [P in keyof T & keyof AggregateCalification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCalification[P]>
      : GetScalarType<T[P], AggregateCalification[P]>
  }




  export type CalificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalificationWhereInput
    orderBy?: CalificationOrderByWithAggregationInput | CalificationOrderByWithAggregationInput[]
    by: CalificationScalarFieldEnum[] | CalificationScalarFieldEnum
    having?: CalificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CalificationCountAggregateInputType | true
    _avg?: CalificationAvgAggregateInputType
    _sum?: CalificationSumAggregateInputType
    _min?: CalificationMinAggregateInputType
    _max?: CalificationMaxAggregateInputType
  }

  export type CalificationGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    title: string
    content: string
    type: string
    totalPoints: number
    maxAttempts: number
    lessonId: string
    _count: CalificationCountAggregateOutputType | null
    _avg: CalificationAvgAggregateOutputType | null
    _sum: CalificationSumAggregateOutputType | null
    _min: CalificationMinAggregateOutputType | null
    _max: CalificationMaxAggregateOutputType | null
  }

  type GetCalificationGroupByPayload<T extends CalificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CalificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CalificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CalificationGroupByOutputType[P]>
            : GetScalarType<T[P], CalificationGroupByOutputType[P]>
        }
      >
    >


  export type CalificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    totalPoints?: boolean
    maxAttempts?: boolean
    lessonId?: boolean
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calification"]>

  export type CalificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    totalPoints?: boolean
    maxAttempts?: boolean
    lessonId?: boolean
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calification"]>

  export type CalificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    totalPoints?: boolean
    maxAttempts?: boolean
    lessonId?: boolean
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calification"]>

  export type CalificationSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    totalPoints?: boolean
    maxAttempts?: boolean
    lessonId?: boolean
  }

  export type CalificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "title" | "content" | "type" | "totalPoints" | "maxAttempts" | "lessonId", ExtArgs["result"]["calification"]>
  export type CalificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }
  export type CalificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }
  export type CalificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }

  export type $CalificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Calification"
    objects: {
      lesson: Prisma.$LessonPayload<ExtArgs>
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
      title: string
      content: string
      type: string
      totalPoints: number
      maxAttempts: number
      lessonId: string
    }, ExtArgs["result"]["calification"]>
    composites: {}
  }

  type CalificationGetPayload<S extends boolean | null | undefined | CalificationDefaultArgs> = $Result.GetResult<Prisma.$CalificationPayload, S>

  type CalificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CalificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CalificationCountAggregateInputType | true
    }

  export interface CalificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Calification'], meta: { name: 'Calification' } }
    /**
     * Find zero or one Calification that matches the filter.
     * @param {CalificationFindUniqueArgs} args - Arguments to find a Calification
     * @example
     * // Get one Calification
     * const calification = await prisma.calification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CalificationFindUniqueArgs>(args: SelectSubset<T, CalificationFindUniqueArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Calification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CalificationFindUniqueOrThrowArgs} args - Arguments to find a Calification
     * @example
     * // Get one Calification
     * const calification = await prisma.calification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CalificationFindUniqueOrThrowArgs>(args: SelectSubset<T, CalificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Calification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificationFindFirstArgs} args - Arguments to find a Calification
     * @example
     * // Get one Calification
     * const calification = await prisma.calification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CalificationFindFirstArgs>(args?: SelectSubset<T, CalificationFindFirstArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Calification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificationFindFirstOrThrowArgs} args - Arguments to find a Calification
     * @example
     * // Get one Calification
     * const calification = await prisma.calification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CalificationFindFirstOrThrowArgs>(args?: SelectSubset<T, CalificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Califications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Califications
     * const califications = await prisma.calification.findMany()
     * 
     * // Get first 10 Califications
     * const califications = await prisma.calification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const calificationWithIdOnly = await prisma.calification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CalificationFindManyArgs>(args?: SelectSubset<T, CalificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Calification.
     * @param {CalificationCreateArgs} args - Arguments to create a Calification.
     * @example
     * // Create one Calification
     * const Calification = await prisma.calification.create({
     *   data: {
     *     // ... data to create a Calification
     *   }
     * })
     * 
     */
    create<T extends CalificationCreateArgs>(args: SelectSubset<T, CalificationCreateArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Califications.
     * @param {CalificationCreateManyArgs} args - Arguments to create many Califications.
     * @example
     * // Create many Califications
     * const calification = await prisma.calification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CalificationCreateManyArgs>(args?: SelectSubset<T, CalificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Califications and returns the data saved in the database.
     * @param {CalificationCreateManyAndReturnArgs} args - Arguments to create many Califications.
     * @example
     * // Create many Califications
     * const calification = await prisma.calification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Califications and only return the `id`
     * const calificationWithIdOnly = await prisma.calification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CalificationCreateManyAndReturnArgs>(args?: SelectSubset<T, CalificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Calification.
     * @param {CalificationDeleteArgs} args - Arguments to delete one Calification.
     * @example
     * // Delete one Calification
     * const Calification = await prisma.calification.delete({
     *   where: {
     *     // ... filter to delete one Calification
     *   }
     * })
     * 
     */
    delete<T extends CalificationDeleteArgs>(args: SelectSubset<T, CalificationDeleteArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Calification.
     * @param {CalificationUpdateArgs} args - Arguments to update one Calification.
     * @example
     * // Update one Calification
     * const calification = await prisma.calification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CalificationUpdateArgs>(args: SelectSubset<T, CalificationUpdateArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Califications.
     * @param {CalificationDeleteManyArgs} args - Arguments to filter Califications to delete.
     * @example
     * // Delete a few Califications
     * const { count } = await prisma.calification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CalificationDeleteManyArgs>(args?: SelectSubset<T, CalificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Califications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Califications
     * const calification = await prisma.calification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CalificationUpdateManyArgs>(args: SelectSubset<T, CalificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Califications and returns the data updated in the database.
     * @param {CalificationUpdateManyAndReturnArgs} args - Arguments to update many Califications.
     * @example
     * // Update many Califications
     * const calification = await prisma.calification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Califications and only return the `id`
     * const calificationWithIdOnly = await prisma.calification.updateManyAndReturn({
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
    updateManyAndReturn<T extends CalificationUpdateManyAndReturnArgs>(args: SelectSubset<T, CalificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Calification.
     * @param {CalificationUpsertArgs} args - Arguments to update or create a Calification.
     * @example
     * // Update or create a Calification
     * const calification = await prisma.calification.upsert({
     *   create: {
     *     // ... data to create a Calification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Calification we want to update
     *   }
     * })
     */
    upsert<T extends CalificationUpsertArgs>(args: SelectSubset<T, CalificationUpsertArgs<ExtArgs>>): Prisma__CalificationClient<$Result.GetResult<Prisma.$CalificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Califications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificationCountArgs} args - Arguments to filter Califications to count.
     * @example
     * // Count the number of Califications
     * const count = await prisma.calification.count({
     *   where: {
     *     // ... the filter for the Califications we want to count
     *   }
     * })
    **/
    count<T extends CalificationCountArgs>(
      args?: Subset<T, CalificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CalificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Calification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CalificationAggregateArgs>(args: Subset<T, CalificationAggregateArgs>): Prisma.PrismaPromise<GetCalificationAggregateType<T>>

    /**
     * Group by Calification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificationGroupByArgs} args - Group by arguments.
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
      T extends CalificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CalificationGroupByArgs['orderBy'] }
        : { orderBy?: CalificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CalificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCalificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Calification model
   */
  readonly fields: CalificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Calification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CalificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lesson<T extends LessonDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LessonDefaultArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Calification model
   */
  interface CalificationFieldRefs {
    readonly id: FieldRef<"Calification", 'String'>
    readonly transactionDate: FieldRef<"Calification", 'DateTime'>
    readonly startDate: FieldRef<"Calification", 'DateTime'>
    readonly endDate: FieldRef<"Calification", 'DateTime'>
    readonly createdBy: FieldRef<"Calification", 'String'>
    readonly updatedBy: FieldRef<"Calification", 'String'>
    readonly createdAt: FieldRef<"Calification", 'DateTime'>
    readonly updatedAt: FieldRef<"Calification", 'DateTime'>
    readonly title: FieldRef<"Calification", 'String'>
    readonly content: FieldRef<"Calification", 'String'>
    readonly type: FieldRef<"Calification", 'String'>
    readonly totalPoints: FieldRef<"Calification", 'Int'>
    readonly maxAttempts: FieldRef<"Calification", 'Int'>
    readonly lessonId: FieldRef<"Calification", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Calification findUnique
   */
  export type CalificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * Filter, which Calification to fetch.
     */
    where: CalificationWhereUniqueInput
  }

  /**
   * Calification findUniqueOrThrow
   */
  export type CalificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * Filter, which Calification to fetch.
     */
    where: CalificationWhereUniqueInput
  }

  /**
   * Calification findFirst
   */
  export type CalificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * Filter, which Calification to fetch.
     */
    where?: CalificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Califications to fetch.
     */
    orderBy?: CalificationOrderByWithRelationInput | CalificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Califications.
     */
    cursor?: CalificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Califications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Califications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Califications.
     */
    distinct?: CalificationScalarFieldEnum | CalificationScalarFieldEnum[]
  }

  /**
   * Calification findFirstOrThrow
   */
  export type CalificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * Filter, which Calification to fetch.
     */
    where?: CalificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Califications to fetch.
     */
    orderBy?: CalificationOrderByWithRelationInput | CalificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Califications.
     */
    cursor?: CalificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Califications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Califications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Califications.
     */
    distinct?: CalificationScalarFieldEnum | CalificationScalarFieldEnum[]
  }

  /**
   * Calification findMany
   */
  export type CalificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * Filter, which Califications to fetch.
     */
    where?: CalificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Califications to fetch.
     */
    orderBy?: CalificationOrderByWithRelationInput | CalificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Califications.
     */
    cursor?: CalificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Califications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Califications.
     */
    skip?: number
    distinct?: CalificationScalarFieldEnum | CalificationScalarFieldEnum[]
  }

  /**
   * Calification create
   */
  export type CalificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Calification.
     */
    data: XOR<CalificationCreateInput, CalificationUncheckedCreateInput>
  }

  /**
   * Calification createMany
   */
  export type CalificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Califications.
     */
    data: CalificationCreateManyInput | CalificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Calification createManyAndReturn
   */
  export type CalificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * The data used to create many Califications.
     */
    data: CalificationCreateManyInput | CalificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Calification update
   */
  export type CalificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Calification.
     */
    data: XOR<CalificationUpdateInput, CalificationUncheckedUpdateInput>
    /**
     * Choose, which Calification to update.
     */
    where: CalificationWhereUniqueInput
  }

  /**
   * Calification updateMany
   */
  export type CalificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Califications.
     */
    data: XOR<CalificationUpdateManyMutationInput, CalificationUncheckedUpdateManyInput>
    /**
     * Filter which Califications to update
     */
    where?: CalificationWhereInput
    /**
     * Limit how many Califications to update.
     */
    limit?: number
  }

  /**
   * Calification updateManyAndReturn
   */
  export type CalificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * The data used to update Califications.
     */
    data: XOR<CalificationUpdateManyMutationInput, CalificationUncheckedUpdateManyInput>
    /**
     * Filter which Califications to update
     */
    where?: CalificationWhereInput
    /**
     * Limit how many Califications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Calification upsert
   */
  export type CalificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Calification to update in case it exists.
     */
    where: CalificationWhereUniqueInput
    /**
     * In case the Calification found by the `where` argument doesn't exist, create a new Calification with this data.
     */
    create: XOR<CalificationCreateInput, CalificationUncheckedCreateInput>
    /**
     * In case the Calification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CalificationUpdateInput, CalificationUncheckedUpdateInput>
  }

  /**
   * Calification delete
   */
  export type CalificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
    /**
     * Filter which Calification to delete.
     */
    where: CalificationWhereUniqueInput
  }

  /**
   * Calification deleteMany
   */
  export type CalificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Califications to delete
     */
    where?: CalificationWhereInput
    /**
     * Limit how many Califications to delete.
     */
    limit?: number
  }

  /**
   * Calification without action
   */
  export type CalificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calification
     */
    select?: CalificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calification
     */
    omit?: CalificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificationInclude<ExtArgs> | null
  }


  /**
   * Model Evaluation
   */

  export type AggregateEvaluation = {
    _count: EvaluationCountAggregateOutputType | null
    _min: EvaluationMinAggregateOutputType | null
    _max: EvaluationMaxAggregateOutputType | null
  }

  export type EvaluationMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    description: string | null
    courseId: string | null
  }

  export type EvaluationMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    title: string | null
    description: string | null
    courseId: string | null
  }

  export type EvaluationCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    title: number
    description: number
    courseId: number
    _all: number
  }


  export type EvaluationMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    description?: true
    courseId?: true
  }

  export type EvaluationMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    description?: true
    courseId?: true
  }

  export type EvaluationCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    title?: true
    description?: true
    courseId?: true
    _all?: true
  }

  export type EvaluationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Evaluation to aggregate.
     */
    where?: EvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evaluations to fetch.
     */
    orderBy?: EvaluationOrderByWithRelationInput | EvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Evaluations
    **/
    _count?: true | EvaluationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EvaluationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EvaluationMaxAggregateInputType
  }

  export type GetEvaluationAggregateType<T extends EvaluationAggregateArgs> = {
        [P in keyof T & keyof AggregateEvaluation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvaluation[P]>
      : GetScalarType<T[P], AggregateEvaluation[P]>
  }




  export type EvaluationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvaluationWhereInput
    orderBy?: EvaluationOrderByWithAggregationInput | EvaluationOrderByWithAggregationInput[]
    by: EvaluationScalarFieldEnum[] | EvaluationScalarFieldEnum
    having?: EvaluationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EvaluationCountAggregateInputType | true
    _min?: EvaluationMinAggregateInputType
    _max?: EvaluationMaxAggregateInputType
  }

  export type EvaluationGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    title: string
    description: string | null
    courseId: string
    _count: EvaluationCountAggregateOutputType | null
    _min: EvaluationMinAggregateOutputType | null
    _max: EvaluationMaxAggregateOutputType | null
  }

  type GetEvaluationGroupByPayload<T extends EvaluationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EvaluationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EvaluationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EvaluationGroupByOutputType[P]>
            : GetScalarType<T[P], EvaluationGroupByOutputType[P]>
        }
      >
    >


  export type EvaluationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    courseId?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
    attempts?: boolean | Evaluation$attemptsArgs<ExtArgs>
    _count?: boolean | EvaluationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluation"]>

  export type EvaluationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    courseId?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluation"]>

  export type EvaluationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    courseId?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluation"]>

  export type EvaluationSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    title?: boolean
    description?: boolean
    courseId?: boolean
  }

  export type EvaluationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "title" | "description" | "courseId", ExtArgs["result"]["evaluation"]>
  export type EvaluationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
    attempts?: boolean | Evaluation$attemptsArgs<ExtArgs>
    _count?: boolean | EvaluationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EvaluationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type EvaluationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $EvaluationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Evaluation"
    objects: {
      course: Prisma.$CoursePayload<ExtArgs>
      attempts: Prisma.$EvaluationAttemptPayload<ExtArgs>[]
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
      title: string
      description: string | null
      courseId: string
    }, ExtArgs["result"]["evaluation"]>
    composites: {}
  }

  type EvaluationGetPayload<S extends boolean | null | undefined | EvaluationDefaultArgs> = $Result.GetResult<Prisma.$EvaluationPayload, S>

  type EvaluationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EvaluationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EvaluationCountAggregateInputType | true
    }

  export interface EvaluationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Evaluation'], meta: { name: 'Evaluation' } }
    /**
     * Find zero or one Evaluation that matches the filter.
     * @param {EvaluationFindUniqueArgs} args - Arguments to find a Evaluation
     * @example
     * // Get one Evaluation
     * const evaluation = await prisma.evaluation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EvaluationFindUniqueArgs>(args: SelectSubset<T, EvaluationFindUniqueArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Evaluation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EvaluationFindUniqueOrThrowArgs} args - Arguments to find a Evaluation
     * @example
     * // Get one Evaluation
     * const evaluation = await prisma.evaluation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EvaluationFindUniqueOrThrowArgs>(args: SelectSubset<T, EvaluationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Evaluation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationFindFirstArgs} args - Arguments to find a Evaluation
     * @example
     * // Get one Evaluation
     * const evaluation = await prisma.evaluation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EvaluationFindFirstArgs>(args?: SelectSubset<T, EvaluationFindFirstArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Evaluation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationFindFirstOrThrowArgs} args - Arguments to find a Evaluation
     * @example
     * // Get one Evaluation
     * const evaluation = await prisma.evaluation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EvaluationFindFirstOrThrowArgs>(args?: SelectSubset<T, EvaluationFindFirstOrThrowArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Evaluations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Evaluations
     * const evaluations = await prisma.evaluation.findMany()
     * 
     * // Get first 10 Evaluations
     * const evaluations = await prisma.evaluation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const evaluationWithIdOnly = await prisma.evaluation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EvaluationFindManyArgs>(args?: SelectSubset<T, EvaluationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Evaluation.
     * @param {EvaluationCreateArgs} args - Arguments to create a Evaluation.
     * @example
     * // Create one Evaluation
     * const Evaluation = await prisma.evaluation.create({
     *   data: {
     *     // ... data to create a Evaluation
     *   }
     * })
     * 
     */
    create<T extends EvaluationCreateArgs>(args: SelectSubset<T, EvaluationCreateArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Evaluations.
     * @param {EvaluationCreateManyArgs} args - Arguments to create many Evaluations.
     * @example
     * // Create many Evaluations
     * const evaluation = await prisma.evaluation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EvaluationCreateManyArgs>(args?: SelectSubset<T, EvaluationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Evaluations and returns the data saved in the database.
     * @param {EvaluationCreateManyAndReturnArgs} args - Arguments to create many Evaluations.
     * @example
     * // Create many Evaluations
     * const evaluation = await prisma.evaluation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Evaluations and only return the `id`
     * const evaluationWithIdOnly = await prisma.evaluation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EvaluationCreateManyAndReturnArgs>(args?: SelectSubset<T, EvaluationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Evaluation.
     * @param {EvaluationDeleteArgs} args - Arguments to delete one Evaluation.
     * @example
     * // Delete one Evaluation
     * const Evaluation = await prisma.evaluation.delete({
     *   where: {
     *     // ... filter to delete one Evaluation
     *   }
     * })
     * 
     */
    delete<T extends EvaluationDeleteArgs>(args: SelectSubset<T, EvaluationDeleteArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Evaluation.
     * @param {EvaluationUpdateArgs} args - Arguments to update one Evaluation.
     * @example
     * // Update one Evaluation
     * const evaluation = await prisma.evaluation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EvaluationUpdateArgs>(args: SelectSubset<T, EvaluationUpdateArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Evaluations.
     * @param {EvaluationDeleteManyArgs} args - Arguments to filter Evaluations to delete.
     * @example
     * // Delete a few Evaluations
     * const { count } = await prisma.evaluation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EvaluationDeleteManyArgs>(args?: SelectSubset<T, EvaluationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Evaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Evaluations
     * const evaluation = await prisma.evaluation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EvaluationUpdateManyArgs>(args: SelectSubset<T, EvaluationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Evaluations and returns the data updated in the database.
     * @param {EvaluationUpdateManyAndReturnArgs} args - Arguments to update many Evaluations.
     * @example
     * // Update many Evaluations
     * const evaluation = await prisma.evaluation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Evaluations and only return the `id`
     * const evaluationWithIdOnly = await prisma.evaluation.updateManyAndReturn({
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
    updateManyAndReturn<T extends EvaluationUpdateManyAndReturnArgs>(args: SelectSubset<T, EvaluationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Evaluation.
     * @param {EvaluationUpsertArgs} args - Arguments to update or create a Evaluation.
     * @example
     * // Update or create a Evaluation
     * const evaluation = await prisma.evaluation.upsert({
     *   create: {
     *     // ... data to create a Evaluation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Evaluation we want to update
     *   }
     * })
     */
    upsert<T extends EvaluationUpsertArgs>(args: SelectSubset<T, EvaluationUpsertArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Evaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationCountArgs} args - Arguments to filter Evaluations to count.
     * @example
     * // Count the number of Evaluations
     * const count = await prisma.evaluation.count({
     *   where: {
     *     // ... the filter for the Evaluations we want to count
     *   }
     * })
    **/
    count<T extends EvaluationCountArgs>(
      args?: Subset<T, EvaluationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EvaluationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Evaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EvaluationAggregateArgs>(args: Subset<T, EvaluationAggregateArgs>): Prisma.PrismaPromise<GetEvaluationAggregateType<T>>

    /**
     * Group by Evaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationGroupByArgs} args - Group by arguments.
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
      T extends EvaluationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EvaluationGroupByArgs['orderBy'] }
        : { orderBy?: EvaluationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EvaluationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvaluationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Evaluation model
   */
  readonly fields: EvaluationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Evaluation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EvaluationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    course<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    attempts<T extends Evaluation$attemptsArgs<ExtArgs> = {}>(args?: Subset<T, Evaluation$attemptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Evaluation model
   */
  interface EvaluationFieldRefs {
    readonly id: FieldRef<"Evaluation", 'String'>
    readonly transactionDate: FieldRef<"Evaluation", 'DateTime'>
    readonly startDate: FieldRef<"Evaluation", 'DateTime'>
    readonly endDate: FieldRef<"Evaluation", 'DateTime'>
    readonly createdBy: FieldRef<"Evaluation", 'String'>
    readonly updatedBy: FieldRef<"Evaluation", 'String'>
    readonly createdAt: FieldRef<"Evaluation", 'DateTime'>
    readonly updatedAt: FieldRef<"Evaluation", 'DateTime'>
    readonly title: FieldRef<"Evaluation", 'String'>
    readonly description: FieldRef<"Evaluation", 'String'>
    readonly courseId: FieldRef<"Evaluation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Evaluation findUnique
   */
  export type EvaluationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * Filter, which Evaluation to fetch.
     */
    where: EvaluationWhereUniqueInput
  }

  /**
   * Evaluation findUniqueOrThrow
   */
  export type EvaluationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * Filter, which Evaluation to fetch.
     */
    where: EvaluationWhereUniqueInput
  }

  /**
   * Evaluation findFirst
   */
  export type EvaluationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * Filter, which Evaluation to fetch.
     */
    where?: EvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evaluations to fetch.
     */
    orderBy?: EvaluationOrderByWithRelationInput | EvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Evaluations.
     */
    cursor?: EvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Evaluations.
     */
    distinct?: EvaluationScalarFieldEnum | EvaluationScalarFieldEnum[]
  }

  /**
   * Evaluation findFirstOrThrow
   */
  export type EvaluationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * Filter, which Evaluation to fetch.
     */
    where?: EvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evaluations to fetch.
     */
    orderBy?: EvaluationOrderByWithRelationInput | EvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Evaluations.
     */
    cursor?: EvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Evaluations.
     */
    distinct?: EvaluationScalarFieldEnum | EvaluationScalarFieldEnum[]
  }

  /**
   * Evaluation findMany
   */
  export type EvaluationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * Filter, which Evaluations to fetch.
     */
    where?: EvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Evaluations to fetch.
     */
    orderBy?: EvaluationOrderByWithRelationInput | EvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Evaluations.
     */
    cursor?: EvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Evaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Evaluations.
     */
    skip?: number
    distinct?: EvaluationScalarFieldEnum | EvaluationScalarFieldEnum[]
  }

  /**
   * Evaluation create
   */
  export type EvaluationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * The data needed to create a Evaluation.
     */
    data: XOR<EvaluationCreateInput, EvaluationUncheckedCreateInput>
  }

  /**
   * Evaluation createMany
   */
  export type EvaluationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Evaluations.
     */
    data: EvaluationCreateManyInput | EvaluationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Evaluation createManyAndReturn
   */
  export type EvaluationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * The data used to create many Evaluations.
     */
    data: EvaluationCreateManyInput | EvaluationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Evaluation update
   */
  export type EvaluationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * The data needed to update a Evaluation.
     */
    data: XOR<EvaluationUpdateInput, EvaluationUncheckedUpdateInput>
    /**
     * Choose, which Evaluation to update.
     */
    where: EvaluationWhereUniqueInput
  }

  /**
   * Evaluation updateMany
   */
  export type EvaluationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Evaluations.
     */
    data: XOR<EvaluationUpdateManyMutationInput, EvaluationUncheckedUpdateManyInput>
    /**
     * Filter which Evaluations to update
     */
    where?: EvaluationWhereInput
    /**
     * Limit how many Evaluations to update.
     */
    limit?: number
  }

  /**
   * Evaluation updateManyAndReturn
   */
  export type EvaluationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * The data used to update Evaluations.
     */
    data: XOR<EvaluationUpdateManyMutationInput, EvaluationUncheckedUpdateManyInput>
    /**
     * Filter which Evaluations to update
     */
    where?: EvaluationWhereInput
    /**
     * Limit how many Evaluations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Evaluation upsert
   */
  export type EvaluationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * The filter to search for the Evaluation to update in case it exists.
     */
    where: EvaluationWhereUniqueInput
    /**
     * In case the Evaluation found by the `where` argument doesn't exist, create a new Evaluation with this data.
     */
    create: XOR<EvaluationCreateInput, EvaluationUncheckedCreateInput>
    /**
     * In case the Evaluation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EvaluationUpdateInput, EvaluationUncheckedUpdateInput>
  }

  /**
   * Evaluation delete
   */
  export type EvaluationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
    /**
     * Filter which Evaluation to delete.
     */
    where: EvaluationWhereUniqueInput
  }

  /**
   * Evaluation deleteMany
   */
  export type EvaluationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Evaluations to delete
     */
    where?: EvaluationWhereInput
    /**
     * Limit how many Evaluations to delete.
     */
    limit?: number
  }

  /**
   * Evaluation.attempts
   */
  export type Evaluation$attemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    where?: EvaluationAttemptWhereInput
    orderBy?: EvaluationAttemptOrderByWithRelationInput | EvaluationAttemptOrderByWithRelationInput[]
    cursor?: EvaluationAttemptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EvaluationAttemptScalarFieldEnum | EvaluationAttemptScalarFieldEnum[]
  }

  /**
   * Evaluation without action
   */
  export type EvaluationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Evaluation
     */
    select?: EvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Evaluation
     */
    omit?: EvaluationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationInclude<ExtArgs> | null
  }


  /**
   * Model EvaluationAttempt
   */

  export type AggregateEvaluationAttempt = {
    _count: EvaluationAttemptCountAggregateOutputType | null
    _avg: EvaluationAttemptAvgAggregateOutputType | null
    _sum: EvaluationAttemptSumAggregateOutputType | null
    _min: EvaluationAttemptMinAggregateOutputType | null
    _max: EvaluationAttemptMaxAggregateOutputType | null
  }

  export type EvaluationAttemptAvgAggregateOutputType = {
    score: Decimal | null
  }

  export type EvaluationAttemptSumAggregateOutputType = {
    score: Decimal | null
  }

  export type EvaluationAttemptMinAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    evaluationId: string | null
    studentId: string | null
    score: Decimal | null
  }

  export type EvaluationAttemptMaxAggregateOutputType = {
    id: string | null
    transactionDate: Date | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    evaluationId: string | null
    studentId: string | null
    score: Decimal | null
  }

  export type EvaluationAttemptCountAggregateOutputType = {
    id: number
    transactionDate: number
    startDate: number
    endDate: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    evaluationId: number
    studentId: number
    answers: number
    score: number
    _all: number
  }


  export type EvaluationAttemptAvgAggregateInputType = {
    score?: true
  }

  export type EvaluationAttemptSumAggregateInputType = {
    score?: true
  }

  export type EvaluationAttemptMinAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    evaluationId?: true
    studentId?: true
    score?: true
  }

  export type EvaluationAttemptMaxAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    evaluationId?: true
    studentId?: true
    score?: true
  }

  export type EvaluationAttemptCountAggregateInputType = {
    id?: true
    transactionDate?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    evaluationId?: true
    studentId?: true
    answers?: true
    score?: true
    _all?: true
  }

  export type EvaluationAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvaluationAttempt to aggregate.
     */
    where?: EvaluationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationAttempts to fetch.
     */
    orderBy?: EvaluationAttemptOrderByWithRelationInput | EvaluationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EvaluationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EvaluationAttempts
    **/
    _count?: true | EvaluationAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EvaluationAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EvaluationAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EvaluationAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EvaluationAttemptMaxAggregateInputType
  }

  export type GetEvaluationAttemptAggregateType<T extends EvaluationAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateEvaluationAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvaluationAttempt[P]>
      : GetScalarType<T[P], AggregateEvaluationAttempt[P]>
  }




  export type EvaluationAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvaluationAttemptWhereInput
    orderBy?: EvaluationAttemptOrderByWithAggregationInput | EvaluationAttemptOrderByWithAggregationInput[]
    by: EvaluationAttemptScalarFieldEnum[] | EvaluationAttemptScalarFieldEnum
    having?: EvaluationAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EvaluationAttemptCountAggregateInputType | true
    _avg?: EvaluationAttemptAvgAggregateInputType
    _sum?: EvaluationAttemptSumAggregateInputType
    _min?: EvaluationAttemptMinAggregateInputType
    _max?: EvaluationAttemptMaxAggregateInputType
  }

  export type EvaluationAttemptGroupByOutputType = {
    id: string
    transactionDate: Date
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    evaluationId: string
    studentId: string
    answers: JsonValue
    score: Decimal | null
    _count: EvaluationAttemptCountAggregateOutputType | null
    _avg: EvaluationAttemptAvgAggregateOutputType | null
    _sum: EvaluationAttemptSumAggregateOutputType | null
    _min: EvaluationAttemptMinAggregateOutputType | null
    _max: EvaluationAttemptMaxAggregateOutputType | null
  }

  type GetEvaluationAttemptGroupByPayload<T extends EvaluationAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EvaluationAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EvaluationAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EvaluationAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], EvaluationAttemptGroupByOutputType[P]>
        }
      >
    >


  export type EvaluationAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    evaluationId?: boolean
    studentId?: boolean
    answers?: boolean
    score?: boolean
    evaluation?: boolean | EvaluationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluationAttempt"]>

  export type EvaluationAttemptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    evaluationId?: boolean
    studentId?: boolean
    answers?: boolean
    score?: boolean
    evaluation?: boolean | EvaluationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluationAttempt"]>

  export type EvaluationAttemptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    evaluationId?: boolean
    studentId?: boolean
    answers?: boolean
    score?: boolean
    evaluation?: boolean | EvaluationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluationAttempt"]>

  export type EvaluationAttemptSelectScalar = {
    id?: boolean
    transactionDate?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    evaluationId?: boolean
    studentId?: boolean
    answers?: boolean
    score?: boolean
  }

  export type EvaluationAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transactionDate" | "startDate" | "endDate" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "evaluationId" | "studentId" | "answers" | "score", ExtArgs["result"]["evaluationAttempt"]>
  export type EvaluationAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evaluation?: boolean | EvaluationDefaultArgs<ExtArgs>
  }
  export type EvaluationAttemptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evaluation?: boolean | EvaluationDefaultArgs<ExtArgs>
  }
  export type EvaluationAttemptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evaluation?: boolean | EvaluationDefaultArgs<ExtArgs>
  }

  export type $EvaluationAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EvaluationAttempt"
    objects: {
      evaluation: Prisma.$EvaluationPayload<ExtArgs>
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
      evaluationId: string
      studentId: string
      answers: Prisma.JsonValue
      score: Prisma.Decimal | null
    }, ExtArgs["result"]["evaluationAttempt"]>
    composites: {}
  }

  type EvaluationAttemptGetPayload<S extends boolean | null | undefined | EvaluationAttemptDefaultArgs> = $Result.GetResult<Prisma.$EvaluationAttemptPayload, S>

  type EvaluationAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EvaluationAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EvaluationAttemptCountAggregateInputType | true
    }

  export interface EvaluationAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EvaluationAttempt'], meta: { name: 'EvaluationAttempt' } }
    /**
     * Find zero or one EvaluationAttempt that matches the filter.
     * @param {EvaluationAttemptFindUniqueArgs} args - Arguments to find a EvaluationAttempt
     * @example
     * // Get one EvaluationAttempt
     * const evaluationAttempt = await prisma.evaluationAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EvaluationAttemptFindUniqueArgs>(args: SelectSubset<T, EvaluationAttemptFindUniqueArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EvaluationAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EvaluationAttemptFindUniqueOrThrowArgs} args - Arguments to find a EvaluationAttempt
     * @example
     * // Get one EvaluationAttempt
     * const evaluationAttempt = await prisma.evaluationAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EvaluationAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, EvaluationAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EvaluationAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAttemptFindFirstArgs} args - Arguments to find a EvaluationAttempt
     * @example
     * // Get one EvaluationAttempt
     * const evaluationAttempt = await prisma.evaluationAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EvaluationAttemptFindFirstArgs>(args?: SelectSubset<T, EvaluationAttemptFindFirstArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EvaluationAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAttemptFindFirstOrThrowArgs} args - Arguments to find a EvaluationAttempt
     * @example
     * // Get one EvaluationAttempt
     * const evaluationAttempt = await prisma.evaluationAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EvaluationAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, EvaluationAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EvaluationAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EvaluationAttempts
     * const evaluationAttempts = await prisma.evaluationAttempt.findMany()
     * 
     * // Get first 10 EvaluationAttempts
     * const evaluationAttempts = await prisma.evaluationAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const evaluationAttemptWithIdOnly = await prisma.evaluationAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EvaluationAttemptFindManyArgs>(args?: SelectSubset<T, EvaluationAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EvaluationAttempt.
     * @param {EvaluationAttemptCreateArgs} args - Arguments to create a EvaluationAttempt.
     * @example
     * // Create one EvaluationAttempt
     * const EvaluationAttempt = await prisma.evaluationAttempt.create({
     *   data: {
     *     // ... data to create a EvaluationAttempt
     *   }
     * })
     * 
     */
    create<T extends EvaluationAttemptCreateArgs>(args: SelectSubset<T, EvaluationAttemptCreateArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EvaluationAttempts.
     * @param {EvaluationAttemptCreateManyArgs} args - Arguments to create many EvaluationAttempts.
     * @example
     * // Create many EvaluationAttempts
     * const evaluationAttempt = await prisma.evaluationAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EvaluationAttemptCreateManyArgs>(args?: SelectSubset<T, EvaluationAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EvaluationAttempts and returns the data saved in the database.
     * @param {EvaluationAttemptCreateManyAndReturnArgs} args - Arguments to create many EvaluationAttempts.
     * @example
     * // Create many EvaluationAttempts
     * const evaluationAttempt = await prisma.evaluationAttempt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EvaluationAttempts and only return the `id`
     * const evaluationAttemptWithIdOnly = await prisma.evaluationAttempt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EvaluationAttemptCreateManyAndReturnArgs>(args?: SelectSubset<T, EvaluationAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EvaluationAttempt.
     * @param {EvaluationAttemptDeleteArgs} args - Arguments to delete one EvaluationAttempt.
     * @example
     * // Delete one EvaluationAttempt
     * const EvaluationAttempt = await prisma.evaluationAttempt.delete({
     *   where: {
     *     // ... filter to delete one EvaluationAttempt
     *   }
     * })
     * 
     */
    delete<T extends EvaluationAttemptDeleteArgs>(args: SelectSubset<T, EvaluationAttemptDeleteArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EvaluationAttempt.
     * @param {EvaluationAttemptUpdateArgs} args - Arguments to update one EvaluationAttempt.
     * @example
     * // Update one EvaluationAttempt
     * const evaluationAttempt = await prisma.evaluationAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EvaluationAttemptUpdateArgs>(args: SelectSubset<T, EvaluationAttemptUpdateArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EvaluationAttempts.
     * @param {EvaluationAttemptDeleteManyArgs} args - Arguments to filter EvaluationAttempts to delete.
     * @example
     * // Delete a few EvaluationAttempts
     * const { count } = await prisma.evaluationAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EvaluationAttemptDeleteManyArgs>(args?: SelectSubset<T, EvaluationAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EvaluationAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EvaluationAttempts
     * const evaluationAttempt = await prisma.evaluationAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EvaluationAttemptUpdateManyArgs>(args: SelectSubset<T, EvaluationAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EvaluationAttempts and returns the data updated in the database.
     * @param {EvaluationAttemptUpdateManyAndReturnArgs} args - Arguments to update many EvaluationAttempts.
     * @example
     * // Update many EvaluationAttempts
     * const evaluationAttempt = await prisma.evaluationAttempt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EvaluationAttempts and only return the `id`
     * const evaluationAttemptWithIdOnly = await prisma.evaluationAttempt.updateManyAndReturn({
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
    updateManyAndReturn<T extends EvaluationAttemptUpdateManyAndReturnArgs>(args: SelectSubset<T, EvaluationAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EvaluationAttempt.
     * @param {EvaluationAttemptUpsertArgs} args - Arguments to update or create a EvaluationAttempt.
     * @example
     * // Update or create a EvaluationAttempt
     * const evaluationAttempt = await prisma.evaluationAttempt.upsert({
     *   create: {
     *     // ... data to create a EvaluationAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EvaluationAttempt we want to update
     *   }
     * })
     */
    upsert<T extends EvaluationAttemptUpsertArgs>(args: SelectSubset<T, EvaluationAttemptUpsertArgs<ExtArgs>>): Prisma__EvaluationAttemptClient<$Result.GetResult<Prisma.$EvaluationAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EvaluationAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAttemptCountArgs} args - Arguments to filter EvaluationAttempts to count.
     * @example
     * // Count the number of EvaluationAttempts
     * const count = await prisma.evaluationAttempt.count({
     *   where: {
     *     // ... the filter for the EvaluationAttempts we want to count
     *   }
     * })
    **/
    count<T extends EvaluationAttemptCountArgs>(
      args?: Subset<T, EvaluationAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EvaluationAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EvaluationAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EvaluationAttemptAggregateArgs>(args: Subset<T, EvaluationAttemptAggregateArgs>): Prisma.PrismaPromise<GetEvaluationAttemptAggregateType<T>>

    /**
     * Group by EvaluationAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationAttemptGroupByArgs} args - Group by arguments.
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
      T extends EvaluationAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EvaluationAttemptGroupByArgs['orderBy'] }
        : { orderBy?: EvaluationAttemptGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EvaluationAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvaluationAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EvaluationAttempt model
   */
  readonly fields: EvaluationAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EvaluationAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EvaluationAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    evaluation<T extends EvaluationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EvaluationDefaultArgs<ExtArgs>>): Prisma__EvaluationClient<$Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the EvaluationAttempt model
   */
  interface EvaluationAttemptFieldRefs {
    readonly id: FieldRef<"EvaluationAttempt", 'String'>
    readonly transactionDate: FieldRef<"EvaluationAttempt", 'DateTime'>
    readonly startDate: FieldRef<"EvaluationAttempt", 'DateTime'>
    readonly endDate: FieldRef<"EvaluationAttempt", 'DateTime'>
    readonly createdBy: FieldRef<"EvaluationAttempt", 'String'>
    readonly updatedBy: FieldRef<"EvaluationAttempt", 'String'>
    readonly createdAt: FieldRef<"EvaluationAttempt", 'DateTime'>
    readonly updatedAt: FieldRef<"EvaluationAttempt", 'DateTime'>
    readonly evaluationId: FieldRef<"EvaluationAttempt", 'String'>
    readonly studentId: FieldRef<"EvaluationAttempt", 'String'>
    readonly answers: FieldRef<"EvaluationAttempt", 'Json'>
    readonly score: FieldRef<"EvaluationAttempt", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * EvaluationAttempt findUnique
   */
  export type EvaluationAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationAttempt to fetch.
     */
    where: EvaluationAttemptWhereUniqueInput
  }

  /**
   * EvaluationAttempt findUniqueOrThrow
   */
  export type EvaluationAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationAttempt to fetch.
     */
    where: EvaluationAttemptWhereUniqueInput
  }

  /**
   * EvaluationAttempt findFirst
   */
  export type EvaluationAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationAttempt to fetch.
     */
    where?: EvaluationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationAttempts to fetch.
     */
    orderBy?: EvaluationAttemptOrderByWithRelationInput | EvaluationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvaluationAttempts.
     */
    cursor?: EvaluationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvaluationAttempts.
     */
    distinct?: EvaluationAttemptScalarFieldEnum | EvaluationAttemptScalarFieldEnum[]
  }

  /**
   * EvaluationAttempt findFirstOrThrow
   */
  export type EvaluationAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationAttempt to fetch.
     */
    where?: EvaluationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationAttempts to fetch.
     */
    orderBy?: EvaluationAttemptOrderByWithRelationInput | EvaluationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvaluationAttempts.
     */
    cursor?: EvaluationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvaluationAttempts.
     */
    distinct?: EvaluationAttemptScalarFieldEnum | EvaluationAttemptScalarFieldEnum[]
  }

  /**
   * EvaluationAttempt findMany
   */
  export type EvaluationAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationAttempts to fetch.
     */
    where?: EvaluationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationAttempts to fetch.
     */
    orderBy?: EvaluationAttemptOrderByWithRelationInput | EvaluationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EvaluationAttempts.
     */
    cursor?: EvaluationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationAttempts.
     */
    skip?: number
    distinct?: EvaluationAttemptScalarFieldEnum | EvaluationAttemptScalarFieldEnum[]
  }

  /**
   * EvaluationAttempt create
   */
  export type EvaluationAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a EvaluationAttempt.
     */
    data: XOR<EvaluationAttemptCreateInput, EvaluationAttemptUncheckedCreateInput>
  }

  /**
   * EvaluationAttempt createMany
   */
  export type EvaluationAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EvaluationAttempts.
     */
    data: EvaluationAttemptCreateManyInput | EvaluationAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EvaluationAttempt createManyAndReturn
   */
  export type EvaluationAttemptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * The data used to create many EvaluationAttempts.
     */
    data: EvaluationAttemptCreateManyInput | EvaluationAttemptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EvaluationAttempt update
   */
  export type EvaluationAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a EvaluationAttempt.
     */
    data: XOR<EvaluationAttemptUpdateInput, EvaluationAttemptUncheckedUpdateInput>
    /**
     * Choose, which EvaluationAttempt to update.
     */
    where: EvaluationAttemptWhereUniqueInput
  }

  /**
   * EvaluationAttempt updateMany
   */
  export type EvaluationAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EvaluationAttempts.
     */
    data: XOR<EvaluationAttemptUpdateManyMutationInput, EvaluationAttemptUncheckedUpdateManyInput>
    /**
     * Filter which EvaluationAttempts to update
     */
    where?: EvaluationAttemptWhereInput
    /**
     * Limit how many EvaluationAttempts to update.
     */
    limit?: number
  }

  /**
   * EvaluationAttempt updateManyAndReturn
   */
  export type EvaluationAttemptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * The data used to update EvaluationAttempts.
     */
    data: XOR<EvaluationAttemptUpdateManyMutationInput, EvaluationAttemptUncheckedUpdateManyInput>
    /**
     * Filter which EvaluationAttempts to update
     */
    where?: EvaluationAttemptWhereInput
    /**
     * Limit how many EvaluationAttempts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EvaluationAttempt upsert
   */
  export type EvaluationAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the EvaluationAttempt to update in case it exists.
     */
    where: EvaluationAttemptWhereUniqueInput
    /**
     * In case the EvaluationAttempt found by the `where` argument doesn't exist, create a new EvaluationAttempt with this data.
     */
    create: XOR<EvaluationAttemptCreateInput, EvaluationAttemptUncheckedCreateInput>
    /**
     * In case the EvaluationAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EvaluationAttemptUpdateInput, EvaluationAttemptUncheckedUpdateInput>
  }

  /**
   * EvaluationAttempt delete
   */
  export type EvaluationAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
    /**
     * Filter which EvaluationAttempt to delete.
     */
    where: EvaluationAttemptWhereUniqueInput
  }

  /**
   * EvaluationAttempt deleteMany
   */
  export type EvaluationAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvaluationAttempts to delete
     */
    where?: EvaluationAttemptWhereInput
    /**
     * Limit how many EvaluationAttempts to delete.
     */
    limit?: number
  }

  /**
   * EvaluationAttempt without action
   */
  export type EvaluationAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationAttempt
     */
    select?: EvaluationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationAttempt
     */
    omit?: EvaluationAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationAttemptInclude<ExtArgs> | null
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


  export const CourseScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'title',
    description: 'description',
    status: 'status',
    level: 'level'
  };

  export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum]


  export const LessonScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'title',
    content: 'content',
    contentType: 'contentType',
    courseId: 'courseId'
  };

  export type LessonScalarFieldEnum = (typeof LessonScalarFieldEnum)[keyof typeof LessonScalarFieldEnum]


  export const InscriptionScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    courseId: 'courseId',
    status: 'status',
    progressPercentage: 'progressPercentage',
    completedAt: 'completedAt'
  };

  export type InscriptionScalarFieldEnum = (typeof InscriptionScalarFieldEnum)[keyof typeof InscriptionScalarFieldEnum]


  export const ProgressScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    inscriptionId: 'inscriptionId',
    lessonsCompleted: 'lessonsCompleted',
    evaluationsCompleted: 'evaluationsCompleted',
    averageScore: 'averageScore',
    progressPercentage: 'progressPercentage',
    lastAccessAt: 'lastAccessAt'
  };

  export type ProgressScalarFieldEnum = (typeof ProgressScalarFieldEnum)[keyof typeof ProgressScalarFieldEnum]


  export const CalificationScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'title',
    content: 'content',
    type: 'type',
    totalPoints: 'totalPoints',
    maxAttempts: 'maxAttempts',
    lessonId: 'lessonId'
  };

  export type CalificationScalarFieldEnum = (typeof CalificationScalarFieldEnum)[keyof typeof CalificationScalarFieldEnum]


  export const EvaluationScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'title',
    description: 'description',
    courseId: 'courseId'
  };

  export type EvaluationScalarFieldEnum = (typeof EvaluationScalarFieldEnum)[keyof typeof EvaluationScalarFieldEnum]


  export const EvaluationAttemptScalarFieldEnum: {
    id: 'id',
    transactionDate: 'transactionDate',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    evaluationId: 'evaluationId',
    studentId: 'studentId',
    answers: 'answers',
    score: 'score'
  };

  export type EvaluationAttemptScalarFieldEnum = (typeof EvaluationAttemptScalarFieldEnum)[keyof typeof EvaluationAttemptScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CourseWhereInput = {
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    id?: UuidFilter<"Course"> | string
    transactionDate?: DateTimeFilter<"Course"> | Date | string
    startDate?: DateTimeNullableFilter<"Course"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Course"> | Date | string | null
    createdBy?: StringNullableFilter<"Course"> | string | null
    updatedBy?: StringNullableFilter<"Course"> | string | null
    createdAt?: DateTimeFilter<"Course"> | Date | string
    updatedAt?: DateTimeFilter<"Course"> | Date | string
    title?: StringFilter<"Course"> | string
    description?: StringFilter<"Course"> | string
    status?: StringFilter<"Course"> | string
    level?: StringFilter<"Course"> | string
    lessons?: LessonListRelationFilter
    inscriptions?: InscriptionListRelationFilter
    evaluations?: EvaluationListRelationFilter
  }

  export type CourseOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    level?: SortOrder
    lessons?: LessonOrderByRelationAggregateInput
    inscriptions?: InscriptionOrderByRelationAggregateInput
    evaluations?: EvaluationOrderByRelationAggregateInput
  }

  export type CourseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    transactionDate?: DateTimeFilter<"Course"> | Date | string
    startDate?: DateTimeNullableFilter<"Course"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Course"> | Date | string | null
    createdBy?: StringNullableFilter<"Course"> | string | null
    updatedBy?: StringNullableFilter<"Course"> | string | null
    createdAt?: DateTimeFilter<"Course"> | Date | string
    updatedAt?: DateTimeFilter<"Course"> | Date | string
    title?: StringFilter<"Course"> | string
    description?: StringFilter<"Course"> | string
    status?: StringFilter<"Course"> | string
    level?: StringFilter<"Course"> | string
    lessons?: LessonListRelationFilter
    inscriptions?: InscriptionListRelationFilter
    evaluations?: EvaluationListRelationFilter
  }, "id">

  export type CourseOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    level?: SortOrder
    _count?: CourseCountOrderByAggregateInput
    _max?: CourseMaxOrderByAggregateInput
    _min?: CourseMinOrderByAggregateInput
  }

  export type CourseScalarWhereWithAggregatesInput = {
    AND?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    OR?: CourseScalarWhereWithAggregatesInput[]
    NOT?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Course"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Course"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Course"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Course"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Course"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Course"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Course"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Course"> | Date | string
    title?: StringWithAggregatesFilter<"Course"> | string
    description?: StringWithAggregatesFilter<"Course"> | string
    status?: StringWithAggregatesFilter<"Course"> | string
    level?: StringWithAggregatesFilter<"Course"> | string
  }

  export type LessonWhereInput = {
    AND?: LessonWhereInput | LessonWhereInput[]
    OR?: LessonWhereInput[]
    NOT?: LessonWhereInput | LessonWhereInput[]
    id?: UuidFilter<"Lesson"> | string
    transactionDate?: DateTimeFilter<"Lesson"> | Date | string
    startDate?: DateTimeNullableFilter<"Lesson"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Lesson"> | Date | string | null
    createdBy?: StringNullableFilter<"Lesson"> | string | null
    updatedBy?: StringNullableFilter<"Lesson"> | string | null
    createdAt?: DateTimeFilter<"Lesson"> | Date | string
    updatedAt?: DateTimeFilter<"Lesson"> | Date | string
    title?: StringFilter<"Lesson"> | string
    content?: StringFilter<"Lesson"> | string
    contentType?: StringFilter<"Lesson"> | string
    courseId?: UuidFilter<"Lesson"> | string
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
    califications?: CalificationListRelationFilter
  }

  export type LessonOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    courseId?: SortOrder
    course?: CourseOrderByWithRelationInput
    califications?: CalificationOrderByRelationAggregateInput
  }

  export type LessonWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LessonWhereInput | LessonWhereInput[]
    OR?: LessonWhereInput[]
    NOT?: LessonWhereInput | LessonWhereInput[]
    transactionDate?: DateTimeFilter<"Lesson"> | Date | string
    startDate?: DateTimeNullableFilter<"Lesson"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Lesson"> | Date | string | null
    createdBy?: StringNullableFilter<"Lesson"> | string | null
    updatedBy?: StringNullableFilter<"Lesson"> | string | null
    createdAt?: DateTimeFilter<"Lesson"> | Date | string
    updatedAt?: DateTimeFilter<"Lesson"> | Date | string
    title?: StringFilter<"Lesson"> | string
    content?: StringFilter<"Lesson"> | string
    contentType?: StringFilter<"Lesson"> | string
    courseId?: UuidFilter<"Lesson"> | string
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
    califications?: CalificationListRelationFilter
  }, "id">

  export type LessonOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    courseId?: SortOrder
    _count?: LessonCountOrderByAggregateInput
    _max?: LessonMaxOrderByAggregateInput
    _min?: LessonMinOrderByAggregateInput
  }

  export type LessonScalarWhereWithAggregatesInput = {
    AND?: LessonScalarWhereWithAggregatesInput | LessonScalarWhereWithAggregatesInput[]
    OR?: LessonScalarWhereWithAggregatesInput[]
    NOT?: LessonScalarWhereWithAggregatesInput | LessonScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Lesson"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Lesson"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Lesson"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Lesson"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Lesson"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Lesson"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Lesson"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Lesson"> | Date | string
    title?: StringWithAggregatesFilter<"Lesson"> | string
    content?: StringWithAggregatesFilter<"Lesson"> | string
    contentType?: StringWithAggregatesFilter<"Lesson"> | string
    courseId?: UuidWithAggregatesFilter<"Lesson"> | string
  }

  export type InscriptionWhereInput = {
    AND?: InscriptionWhereInput | InscriptionWhereInput[]
    OR?: InscriptionWhereInput[]
    NOT?: InscriptionWhereInput | InscriptionWhereInput[]
    id?: UuidFilter<"Inscription"> | string
    transactionDate?: DateTimeFilter<"Inscription"> | Date | string
    startDate?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    createdBy?: StringNullableFilter<"Inscription"> | string | null
    updatedBy?: StringNullableFilter<"Inscription"> | string | null
    createdAt?: DateTimeFilter<"Inscription"> | Date | string
    updatedAt?: DateTimeFilter<"Inscription"> | Date | string
    userId?: UuidFilter<"Inscription"> | string
    courseId?: UuidFilter<"Inscription"> | string
    status?: StringFilter<"Inscription"> | string
    progressPercentage?: DecimalNullableFilter<"Inscription"> | Decimal | DecimalJsLike | number | string | null
    completedAt?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
    progress?: ProgressListRelationFilter
  }

  export type InscriptionOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    status?: SortOrder
    progressPercentage?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    course?: CourseOrderByWithRelationInput
    progress?: ProgressOrderByRelationAggregateInput
  }

  export type InscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InscriptionWhereInput | InscriptionWhereInput[]
    OR?: InscriptionWhereInput[]
    NOT?: InscriptionWhereInput | InscriptionWhereInput[]
    transactionDate?: DateTimeFilter<"Inscription"> | Date | string
    startDate?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    createdBy?: StringNullableFilter<"Inscription"> | string | null
    updatedBy?: StringNullableFilter<"Inscription"> | string | null
    createdAt?: DateTimeFilter<"Inscription"> | Date | string
    updatedAt?: DateTimeFilter<"Inscription"> | Date | string
    userId?: UuidFilter<"Inscription"> | string
    courseId?: UuidFilter<"Inscription"> | string
    status?: StringFilter<"Inscription"> | string
    progressPercentage?: DecimalNullableFilter<"Inscription"> | Decimal | DecimalJsLike | number | string | null
    completedAt?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
    progress?: ProgressListRelationFilter
  }, "id">

  export type InscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    status?: SortOrder
    progressPercentage?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: InscriptionCountOrderByAggregateInput
    _avg?: InscriptionAvgOrderByAggregateInput
    _max?: InscriptionMaxOrderByAggregateInput
    _min?: InscriptionMinOrderByAggregateInput
    _sum?: InscriptionSumOrderByAggregateInput
  }

  export type InscriptionScalarWhereWithAggregatesInput = {
    AND?: InscriptionScalarWhereWithAggregatesInput | InscriptionScalarWhereWithAggregatesInput[]
    OR?: InscriptionScalarWhereWithAggregatesInput[]
    NOT?: InscriptionScalarWhereWithAggregatesInput | InscriptionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Inscription"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Inscription"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Inscription"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Inscription"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Inscription"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Inscription"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Inscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inscription"> | Date | string
    userId?: UuidWithAggregatesFilter<"Inscription"> | string
    courseId?: UuidWithAggregatesFilter<"Inscription"> | string
    status?: StringWithAggregatesFilter<"Inscription"> | string
    progressPercentage?: DecimalNullableWithAggregatesFilter<"Inscription"> | Decimal | DecimalJsLike | number | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Inscription"> | Date | string | null
  }

  export type ProgressWhereInput = {
    AND?: ProgressWhereInput | ProgressWhereInput[]
    OR?: ProgressWhereInput[]
    NOT?: ProgressWhereInput | ProgressWhereInput[]
    id?: UuidFilter<"Progress"> | string
    transactionDate?: DateTimeFilter<"Progress"> | Date | string
    startDate?: DateTimeNullableFilter<"Progress"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Progress"> | Date | string | null
    createdBy?: StringNullableFilter<"Progress"> | string | null
    updatedBy?: StringNullableFilter<"Progress"> | string | null
    createdAt?: DateTimeFilter<"Progress"> | Date | string
    updatedAt?: DateTimeFilter<"Progress"> | Date | string
    inscriptionId?: UuidFilter<"Progress"> | string
    lessonsCompleted?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    lastAccessAt?: DateTimeNullableFilter<"Progress"> | Date | string | null
    inscription?: XOR<InscriptionScalarRelationFilter, InscriptionWhereInput>
  }

  export type ProgressOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inscriptionId?: SortOrder
    lessonsCompleted?: SortOrder
    evaluationsCompleted?: SortOrder
    averageScore?: SortOrder
    progressPercentage?: SortOrder
    lastAccessAt?: SortOrderInput | SortOrder
    inscription?: InscriptionOrderByWithRelationInput
  }

  export type ProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProgressWhereInput | ProgressWhereInput[]
    OR?: ProgressWhereInput[]
    NOT?: ProgressWhereInput | ProgressWhereInput[]
    transactionDate?: DateTimeFilter<"Progress"> | Date | string
    startDate?: DateTimeNullableFilter<"Progress"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Progress"> | Date | string | null
    createdBy?: StringNullableFilter<"Progress"> | string | null
    updatedBy?: StringNullableFilter<"Progress"> | string | null
    createdAt?: DateTimeFilter<"Progress"> | Date | string
    updatedAt?: DateTimeFilter<"Progress"> | Date | string
    inscriptionId?: UuidFilter<"Progress"> | string
    lessonsCompleted?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    lastAccessAt?: DateTimeNullableFilter<"Progress"> | Date | string | null
    inscription?: XOR<InscriptionScalarRelationFilter, InscriptionWhereInput>
  }, "id">

  export type ProgressOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inscriptionId?: SortOrder
    lessonsCompleted?: SortOrder
    evaluationsCompleted?: SortOrder
    averageScore?: SortOrder
    progressPercentage?: SortOrder
    lastAccessAt?: SortOrderInput | SortOrder
    _count?: ProgressCountOrderByAggregateInput
    _avg?: ProgressAvgOrderByAggregateInput
    _max?: ProgressMaxOrderByAggregateInput
    _min?: ProgressMinOrderByAggregateInput
    _sum?: ProgressSumOrderByAggregateInput
  }

  export type ProgressScalarWhereWithAggregatesInput = {
    AND?: ProgressScalarWhereWithAggregatesInput | ProgressScalarWhereWithAggregatesInput[]
    OR?: ProgressScalarWhereWithAggregatesInput[]
    NOT?: ProgressScalarWhereWithAggregatesInput | ProgressScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Progress"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Progress"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Progress"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Progress"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Progress"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Progress"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Progress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Progress"> | Date | string
    inscriptionId?: UuidWithAggregatesFilter<"Progress"> | string
    lessonsCompleted?: DecimalWithAggregatesFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalWithAggregatesFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalWithAggregatesFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalWithAggregatesFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    lastAccessAt?: DateTimeNullableWithAggregatesFilter<"Progress"> | Date | string | null
  }

  export type CalificationWhereInput = {
    AND?: CalificationWhereInput | CalificationWhereInput[]
    OR?: CalificationWhereInput[]
    NOT?: CalificationWhereInput | CalificationWhereInput[]
    id?: UuidFilter<"Calification"> | string
    transactionDate?: DateTimeFilter<"Calification"> | Date | string
    startDate?: DateTimeNullableFilter<"Calification"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Calification"> | Date | string | null
    createdBy?: StringNullableFilter<"Calification"> | string | null
    updatedBy?: StringNullableFilter<"Calification"> | string | null
    createdAt?: DateTimeFilter<"Calification"> | Date | string
    updatedAt?: DateTimeFilter<"Calification"> | Date | string
    title?: StringFilter<"Calification"> | string
    content?: StringFilter<"Calification"> | string
    type?: StringFilter<"Calification"> | string
    totalPoints?: IntFilter<"Calification"> | number
    maxAttempts?: IntFilter<"Calification"> | number
    lessonId?: UuidFilter<"Calification"> | string
    lesson?: XOR<LessonScalarRelationFilter, LessonWhereInput>
  }

  export type CalificationOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    totalPoints?: SortOrder
    maxAttempts?: SortOrder
    lessonId?: SortOrder
    lesson?: LessonOrderByWithRelationInput
  }

  export type CalificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CalificationWhereInput | CalificationWhereInput[]
    OR?: CalificationWhereInput[]
    NOT?: CalificationWhereInput | CalificationWhereInput[]
    transactionDate?: DateTimeFilter<"Calification"> | Date | string
    startDate?: DateTimeNullableFilter<"Calification"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Calification"> | Date | string | null
    createdBy?: StringNullableFilter<"Calification"> | string | null
    updatedBy?: StringNullableFilter<"Calification"> | string | null
    createdAt?: DateTimeFilter<"Calification"> | Date | string
    updatedAt?: DateTimeFilter<"Calification"> | Date | string
    title?: StringFilter<"Calification"> | string
    content?: StringFilter<"Calification"> | string
    type?: StringFilter<"Calification"> | string
    totalPoints?: IntFilter<"Calification"> | number
    maxAttempts?: IntFilter<"Calification"> | number
    lessonId?: UuidFilter<"Calification"> | string
    lesson?: XOR<LessonScalarRelationFilter, LessonWhereInput>
  }, "id">

  export type CalificationOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    totalPoints?: SortOrder
    maxAttempts?: SortOrder
    lessonId?: SortOrder
    _count?: CalificationCountOrderByAggregateInput
    _avg?: CalificationAvgOrderByAggregateInput
    _max?: CalificationMaxOrderByAggregateInput
    _min?: CalificationMinOrderByAggregateInput
    _sum?: CalificationSumOrderByAggregateInput
  }

  export type CalificationScalarWhereWithAggregatesInput = {
    AND?: CalificationScalarWhereWithAggregatesInput | CalificationScalarWhereWithAggregatesInput[]
    OR?: CalificationScalarWhereWithAggregatesInput[]
    NOT?: CalificationScalarWhereWithAggregatesInput | CalificationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Calification"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Calification"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Calification"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Calification"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Calification"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Calification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Calification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Calification"> | Date | string
    title?: StringWithAggregatesFilter<"Calification"> | string
    content?: StringWithAggregatesFilter<"Calification"> | string
    type?: StringWithAggregatesFilter<"Calification"> | string
    totalPoints?: IntWithAggregatesFilter<"Calification"> | number
    maxAttempts?: IntWithAggregatesFilter<"Calification"> | number
    lessonId?: UuidWithAggregatesFilter<"Calification"> | string
  }

  export type EvaluationWhereInput = {
    AND?: EvaluationWhereInput | EvaluationWhereInput[]
    OR?: EvaluationWhereInput[]
    NOT?: EvaluationWhereInput | EvaluationWhereInput[]
    id?: UuidFilter<"Evaluation"> | string
    transactionDate?: DateTimeFilter<"Evaluation"> | Date | string
    startDate?: DateTimeNullableFilter<"Evaluation"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Evaluation"> | Date | string | null
    createdBy?: StringNullableFilter<"Evaluation"> | string | null
    updatedBy?: StringNullableFilter<"Evaluation"> | string | null
    createdAt?: DateTimeFilter<"Evaluation"> | Date | string
    updatedAt?: DateTimeFilter<"Evaluation"> | Date | string
    title?: StringFilter<"Evaluation"> | string
    description?: StringNullableFilter<"Evaluation"> | string | null
    courseId?: UuidFilter<"Evaluation"> | string
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
    attempts?: EvaluationAttemptListRelationFilter
  }

  export type EvaluationOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    courseId?: SortOrder
    course?: CourseOrderByWithRelationInput
    attempts?: EvaluationAttemptOrderByRelationAggregateInput
  }

  export type EvaluationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EvaluationWhereInput | EvaluationWhereInput[]
    OR?: EvaluationWhereInput[]
    NOT?: EvaluationWhereInput | EvaluationWhereInput[]
    transactionDate?: DateTimeFilter<"Evaluation"> | Date | string
    startDate?: DateTimeNullableFilter<"Evaluation"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Evaluation"> | Date | string | null
    createdBy?: StringNullableFilter<"Evaluation"> | string | null
    updatedBy?: StringNullableFilter<"Evaluation"> | string | null
    createdAt?: DateTimeFilter<"Evaluation"> | Date | string
    updatedAt?: DateTimeFilter<"Evaluation"> | Date | string
    title?: StringFilter<"Evaluation"> | string
    description?: StringNullableFilter<"Evaluation"> | string | null
    courseId?: UuidFilter<"Evaluation"> | string
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
    attempts?: EvaluationAttemptListRelationFilter
  }, "id">

  export type EvaluationOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    courseId?: SortOrder
    _count?: EvaluationCountOrderByAggregateInput
    _max?: EvaluationMaxOrderByAggregateInput
    _min?: EvaluationMinOrderByAggregateInput
  }

  export type EvaluationScalarWhereWithAggregatesInput = {
    AND?: EvaluationScalarWhereWithAggregatesInput | EvaluationScalarWhereWithAggregatesInput[]
    OR?: EvaluationScalarWhereWithAggregatesInput[]
    NOT?: EvaluationScalarWhereWithAggregatesInput | EvaluationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Evaluation"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"Evaluation"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Evaluation"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Evaluation"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Evaluation"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Evaluation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Evaluation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Evaluation"> | Date | string
    title?: StringWithAggregatesFilter<"Evaluation"> | string
    description?: StringNullableWithAggregatesFilter<"Evaluation"> | string | null
    courseId?: UuidWithAggregatesFilter<"Evaluation"> | string
  }

  export type EvaluationAttemptWhereInput = {
    AND?: EvaluationAttemptWhereInput | EvaluationAttemptWhereInput[]
    OR?: EvaluationAttemptWhereInput[]
    NOT?: EvaluationAttemptWhereInput | EvaluationAttemptWhereInput[]
    id?: UuidFilter<"EvaluationAttempt"> | string
    transactionDate?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    startDate?: DateTimeNullableFilter<"EvaluationAttempt"> | Date | string | null
    endDate?: DateTimeNullableFilter<"EvaluationAttempt"> | Date | string | null
    createdBy?: StringNullableFilter<"EvaluationAttempt"> | string | null
    updatedBy?: StringNullableFilter<"EvaluationAttempt"> | string | null
    createdAt?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    updatedAt?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    evaluationId?: UuidFilter<"EvaluationAttempt"> | string
    studentId?: UuidFilter<"EvaluationAttempt"> | string
    answers?: JsonFilter<"EvaluationAttempt">
    score?: DecimalNullableFilter<"EvaluationAttempt"> | Decimal | DecimalJsLike | number | string | null
    evaluation?: XOR<EvaluationScalarRelationFilter, EvaluationWhereInput>
  }

  export type EvaluationAttemptOrderByWithRelationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    evaluationId?: SortOrder
    studentId?: SortOrder
    answers?: SortOrder
    score?: SortOrderInput | SortOrder
    evaluation?: EvaluationOrderByWithRelationInput
  }

  export type EvaluationAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EvaluationAttemptWhereInput | EvaluationAttemptWhereInput[]
    OR?: EvaluationAttemptWhereInput[]
    NOT?: EvaluationAttemptWhereInput | EvaluationAttemptWhereInput[]
    transactionDate?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    startDate?: DateTimeNullableFilter<"EvaluationAttempt"> | Date | string | null
    endDate?: DateTimeNullableFilter<"EvaluationAttempt"> | Date | string | null
    createdBy?: StringNullableFilter<"EvaluationAttempt"> | string | null
    updatedBy?: StringNullableFilter<"EvaluationAttempt"> | string | null
    createdAt?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    updatedAt?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    evaluationId?: UuidFilter<"EvaluationAttempt"> | string
    studentId?: UuidFilter<"EvaluationAttempt"> | string
    answers?: JsonFilter<"EvaluationAttempt">
    score?: DecimalNullableFilter<"EvaluationAttempt"> | Decimal | DecimalJsLike | number | string | null
    evaluation?: XOR<EvaluationScalarRelationFilter, EvaluationWhereInput>
  }, "id">

  export type EvaluationAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    evaluationId?: SortOrder
    studentId?: SortOrder
    answers?: SortOrder
    score?: SortOrderInput | SortOrder
    _count?: EvaluationAttemptCountOrderByAggregateInput
    _avg?: EvaluationAttemptAvgOrderByAggregateInput
    _max?: EvaluationAttemptMaxOrderByAggregateInput
    _min?: EvaluationAttemptMinOrderByAggregateInput
    _sum?: EvaluationAttemptSumOrderByAggregateInput
  }

  export type EvaluationAttemptScalarWhereWithAggregatesInput = {
    AND?: EvaluationAttemptScalarWhereWithAggregatesInput | EvaluationAttemptScalarWhereWithAggregatesInput[]
    OR?: EvaluationAttemptScalarWhereWithAggregatesInput[]
    NOT?: EvaluationAttemptScalarWhereWithAggregatesInput | EvaluationAttemptScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EvaluationAttempt"> | string
    transactionDate?: DateTimeWithAggregatesFilter<"EvaluationAttempt"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"EvaluationAttempt"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"EvaluationAttempt"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"EvaluationAttempt"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"EvaluationAttempt"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EvaluationAttempt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EvaluationAttempt"> | Date | string
    evaluationId?: UuidWithAggregatesFilter<"EvaluationAttempt"> | string
    studentId?: UuidWithAggregatesFilter<"EvaluationAttempt"> | string
    answers?: JsonWithAggregatesFilter<"EvaluationAttempt">
    score?: DecimalNullableWithAggregatesFilter<"EvaluationAttempt"> | Decimal | DecimalJsLike | number | string | null
  }

  export type CourseCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    lessons?: LessonCreateNestedManyWithoutCourseInput
    inscriptions?: InscriptionCreateNestedManyWithoutCourseInput
    evaluations?: EvaluationCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    lessons?: LessonUncheckedCreateNestedManyWithoutCourseInput
    inscriptions?: InscriptionUncheckedCreateNestedManyWithoutCourseInput
    evaluations?: EvaluationUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    lessons?: LessonUpdateManyWithoutCourseNestedInput
    inscriptions?: InscriptionUpdateManyWithoutCourseNestedInput
    evaluations?: EvaluationUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    lessons?: LessonUncheckedUpdateManyWithoutCourseNestedInput
    inscriptions?: InscriptionUncheckedUpdateManyWithoutCourseNestedInput
    evaluations?: EvaluationUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type CourseCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
  }

  export type CourseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
  }

  export type CourseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
  }

  export type LessonCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
    course: CourseCreateNestedOneWithoutLessonsInput
    califications?: CalificationCreateNestedManyWithoutLessonInput
  }

  export type LessonUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
    courseId: string
    califications?: CalificationUncheckedCreateNestedManyWithoutLessonInput
  }

  export type LessonUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    course?: CourseUpdateOneRequiredWithoutLessonsNestedInput
    califications?: CalificationUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    califications?: CalificationUncheckedUpdateManyWithoutLessonNestedInput
  }

  export type LessonCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
    courseId: string
  }

  export type LessonUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
  }

  export type LessonUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type InscriptionCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
    course: CourseCreateNestedOneWithoutInscriptionsInput
    progress?: ProgressCreateNestedManyWithoutInscriptionInput
  }

  export type InscriptionUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
    progress?: ProgressUncheckedCreateNestedManyWithoutInscriptionInput
  }

  export type InscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    course?: CourseUpdateOneRequiredWithoutInscriptionsNestedInput
    progress?: ProgressUpdateManyWithoutInscriptionNestedInput
  }

  export type InscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progress?: ProgressUncheckedUpdateManyWithoutInscriptionNestedInput
  }

  export type InscriptionCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
  }

  export type InscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lessonsCompleted?: Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: Decimal | DecimalJsLike | number | string
    averageScore?: Decimal | DecimalJsLike | number | string
    progressPercentage?: Decimal | DecimalJsLike | number | string
    lastAccessAt?: Date | string | null
    inscription: InscriptionCreateNestedOneWithoutProgressInput
  }

  export type ProgressUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionId: string
    lessonsCompleted?: Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: Decimal | DecimalJsLike | number | string
    averageScore?: Decimal | DecimalJsLike | number | string
    progressPercentage?: Decimal | DecimalJsLike | number | string
    lastAccessAt?: Date | string | null
  }

  export type ProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessonsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inscription?: InscriptionUpdateOneRequiredWithoutProgressNestedInput
  }

  export type ProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionId?: StringFieldUpdateOperationsInput | string
    lessonsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inscriptionId: string
    lessonsCompleted?: Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: Decimal | DecimalJsLike | number | string
    averageScore?: Decimal | DecimalJsLike | number | string
    progressPercentage?: Decimal | DecimalJsLike | number | string
    lastAccessAt?: Date | string | null
  }

  export type ProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessonsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inscriptionId?: StringFieldUpdateOperationsInput | string
    lessonsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CalificationCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    type?: string
    totalPoints?: number
    maxAttempts?: number
    lesson: LessonCreateNestedOneWithoutCalificationsInput
  }

  export type CalificationUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    type?: string
    totalPoints?: number
    maxAttempts?: number
    lessonId: string
  }

  export type CalificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    lesson?: LessonUpdateOneRequiredWithoutCalificationsNestedInput
  }

  export type CalificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    lessonId?: StringFieldUpdateOperationsInput | string
  }

  export type CalificationCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    type?: string
    totalPoints?: number
    maxAttempts?: number
    lessonId: string
  }

  export type CalificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
  }

  export type CalificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    lessonId?: StringFieldUpdateOperationsInput | string
  }

  export type EvaluationCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
    course: CourseCreateNestedOneWithoutEvaluationsInput
    attempts?: EvaluationAttemptCreateNestedManyWithoutEvaluationInput
  }

  export type EvaluationUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
    courseId: string
    attempts?: EvaluationAttemptUncheckedCreateNestedManyWithoutEvaluationInput
  }

  export type EvaluationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    course?: CourseUpdateOneRequiredWithoutEvaluationsNestedInput
    attempts?: EvaluationAttemptUpdateManyWithoutEvaluationNestedInput
  }

  export type EvaluationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    courseId?: StringFieldUpdateOperationsInput | string
    attempts?: EvaluationAttemptUncheckedUpdateManyWithoutEvaluationNestedInput
  }

  export type EvaluationCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
    courseId: string
  }

  export type EvaluationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EvaluationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type EvaluationAttemptCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    studentId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: Decimal | DecimalJsLike | number | string | null
    evaluation: EvaluationCreateNestedOneWithoutAttemptsInput
  }

  export type EvaluationAttemptUncheckedCreateInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evaluationId: string
    studentId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    evaluation?: EvaluationUpdateOneRequiredWithoutAttemptsNestedInput
  }

  export type EvaluationAttemptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evaluationId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptCreateManyInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evaluationId: string
    studentId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evaluationId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
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

  export type LessonListRelationFilter = {
    every?: LessonWhereInput
    some?: LessonWhereInput
    none?: LessonWhereInput
  }

  export type InscriptionListRelationFilter = {
    every?: InscriptionWhereInput
    some?: InscriptionWhereInput
    none?: InscriptionWhereInput
  }

  export type EvaluationListRelationFilter = {
    every?: EvaluationWhereInput
    some?: EvaluationWhereInput
    none?: EvaluationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LessonOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EvaluationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CourseCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    level?: SortOrder
  }

  export type CourseMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    level?: SortOrder
  }

  export type CourseMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    level?: SortOrder
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

  export type CourseScalarRelationFilter = {
    is?: CourseWhereInput
    isNot?: CourseWhereInput
  }

  export type CalificationListRelationFilter = {
    every?: CalificationWhereInput
    some?: CalificationWhereInput
    none?: CalificationWhereInput
  }

  export type CalificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LessonCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    courseId?: SortOrder
  }

  export type LessonMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    courseId?: SortOrder
  }

  export type LessonMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    courseId?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type ProgressListRelationFilter = {
    every?: ProgressWhereInput
    some?: ProgressWhereInput
    none?: ProgressWhereInput
  }

  export type ProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    status?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrder
  }

  export type InscriptionAvgOrderByAggregateInput = {
    progressPercentage?: SortOrder
  }

  export type InscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    status?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrder
  }

  export type InscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    status?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrder
  }

  export type InscriptionSumOrderByAggregateInput = {
    progressPercentage?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type InscriptionScalarRelationFilter = {
    is?: InscriptionWhereInput
    isNot?: InscriptionWhereInput
  }

  export type ProgressCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inscriptionId?: SortOrder
    lessonsCompleted?: SortOrder
    evaluationsCompleted?: SortOrder
    averageScore?: SortOrder
    progressPercentage?: SortOrder
    lastAccessAt?: SortOrder
  }

  export type ProgressAvgOrderByAggregateInput = {
    lessonsCompleted?: SortOrder
    evaluationsCompleted?: SortOrder
    averageScore?: SortOrder
    progressPercentage?: SortOrder
  }

  export type ProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inscriptionId?: SortOrder
    lessonsCompleted?: SortOrder
    evaluationsCompleted?: SortOrder
    averageScore?: SortOrder
    progressPercentage?: SortOrder
    lastAccessAt?: SortOrder
  }

  export type ProgressMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inscriptionId?: SortOrder
    lessonsCompleted?: SortOrder
    evaluationsCompleted?: SortOrder
    averageScore?: SortOrder
    progressPercentage?: SortOrder
    lastAccessAt?: SortOrder
  }

  export type ProgressSumOrderByAggregateInput = {
    lessonsCompleted?: SortOrder
    evaluationsCompleted?: SortOrder
    averageScore?: SortOrder
    progressPercentage?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type LessonScalarRelationFilter = {
    is?: LessonWhereInput
    isNot?: LessonWhereInput
  }

  export type CalificationCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    totalPoints?: SortOrder
    maxAttempts?: SortOrder
    lessonId?: SortOrder
  }

  export type CalificationAvgOrderByAggregateInput = {
    totalPoints?: SortOrder
    maxAttempts?: SortOrder
  }

  export type CalificationMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    totalPoints?: SortOrder
    maxAttempts?: SortOrder
    lessonId?: SortOrder
  }

  export type CalificationMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    totalPoints?: SortOrder
    maxAttempts?: SortOrder
    lessonId?: SortOrder
  }

  export type CalificationSumOrderByAggregateInput = {
    totalPoints?: SortOrder
    maxAttempts?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EvaluationAttemptListRelationFilter = {
    every?: EvaluationAttemptWhereInput
    some?: EvaluationAttemptWhereInput
    none?: EvaluationAttemptWhereInput
  }

  export type EvaluationAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EvaluationCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    courseId?: SortOrder
  }

  export type EvaluationMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    courseId?: SortOrder
  }

  export type EvaluationMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    title?: SortOrder
    description?: SortOrder
    courseId?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EvaluationScalarRelationFilter = {
    is?: EvaluationWhereInput
    isNot?: EvaluationWhereInput
  }

  export type EvaluationAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    evaluationId?: SortOrder
    studentId?: SortOrder
    answers?: SortOrder
    score?: SortOrder
  }

  export type EvaluationAttemptAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type EvaluationAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    evaluationId?: SortOrder
    studentId?: SortOrder
    score?: SortOrder
  }

  export type EvaluationAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    transactionDate?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    evaluationId?: SortOrder
    studentId?: SortOrder
    score?: SortOrder
  }

  export type EvaluationAttemptSumOrderByAggregateInput = {
    score?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type LessonCreateNestedManyWithoutCourseInput = {
    create?: XOR<LessonCreateWithoutCourseInput, LessonUncheckedCreateWithoutCourseInput> | LessonCreateWithoutCourseInput[] | LessonUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutCourseInput | LessonCreateOrConnectWithoutCourseInput[]
    createMany?: LessonCreateManyCourseInputEnvelope
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
  }

  export type InscriptionCreateNestedManyWithoutCourseInput = {
    create?: XOR<InscriptionCreateWithoutCourseInput, InscriptionUncheckedCreateWithoutCourseInput> | InscriptionCreateWithoutCourseInput[] | InscriptionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: InscriptionCreateOrConnectWithoutCourseInput | InscriptionCreateOrConnectWithoutCourseInput[]
    createMany?: InscriptionCreateManyCourseInputEnvelope
    connect?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
  }

  export type EvaluationCreateNestedManyWithoutCourseInput = {
    create?: XOR<EvaluationCreateWithoutCourseInput, EvaluationUncheckedCreateWithoutCourseInput> | EvaluationCreateWithoutCourseInput[] | EvaluationUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: EvaluationCreateOrConnectWithoutCourseInput | EvaluationCreateOrConnectWithoutCourseInput[]
    createMany?: EvaluationCreateManyCourseInputEnvelope
    connect?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
  }

  export type LessonUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<LessonCreateWithoutCourseInput, LessonUncheckedCreateWithoutCourseInput> | LessonCreateWithoutCourseInput[] | LessonUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutCourseInput | LessonCreateOrConnectWithoutCourseInput[]
    createMany?: LessonCreateManyCourseInputEnvelope
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
  }

  export type InscriptionUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<InscriptionCreateWithoutCourseInput, InscriptionUncheckedCreateWithoutCourseInput> | InscriptionCreateWithoutCourseInput[] | InscriptionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: InscriptionCreateOrConnectWithoutCourseInput | InscriptionCreateOrConnectWithoutCourseInput[]
    createMany?: InscriptionCreateManyCourseInputEnvelope
    connect?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
  }

  export type EvaluationUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<EvaluationCreateWithoutCourseInput, EvaluationUncheckedCreateWithoutCourseInput> | EvaluationCreateWithoutCourseInput[] | EvaluationUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: EvaluationCreateOrConnectWithoutCourseInput | EvaluationCreateOrConnectWithoutCourseInput[]
    createMany?: EvaluationCreateManyCourseInputEnvelope
    connect?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
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

  export type LessonUpdateManyWithoutCourseNestedInput = {
    create?: XOR<LessonCreateWithoutCourseInput, LessonUncheckedCreateWithoutCourseInput> | LessonCreateWithoutCourseInput[] | LessonUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutCourseInput | LessonCreateOrConnectWithoutCourseInput[]
    upsert?: LessonUpsertWithWhereUniqueWithoutCourseInput | LessonUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: LessonCreateManyCourseInputEnvelope
    set?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    disconnect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    delete?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    update?: LessonUpdateWithWhereUniqueWithoutCourseInput | LessonUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: LessonUpdateManyWithWhereWithoutCourseInput | LessonUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: LessonScalarWhereInput | LessonScalarWhereInput[]
  }

  export type InscriptionUpdateManyWithoutCourseNestedInput = {
    create?: XOR<InscriptionCreateWithoutCourseInput, InscriptionUncheckedCreateWithoutCourseInput> | InscriptionCreateWithoutCourseInput[] | InscriptionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: InscriptionCreateOrConnectWithoutCourseInput | InscriptionCreateOrConnectWithoutCourseInput[]
    upsert?: InscriptionUpsertWithWhereUniqueWithoutCourseInput | InscriptionUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: InscriptionCreateManyCourseInputEnvelope
    set?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    disconnect?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    delete?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    connect?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    update?: InscriptionUpdateWithWhereUniqueWithoutCourseInput | InscriptionUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: InscriptionUpdateManyWithWhereWithoutCourseInput | InscriptionUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: InscriptionScalarWhereInput | InscriptionScalarWhereInput[]
  }

  export type EvaluationUpdateManyWithoutCourseNestedInput = {
    create?: XOR<EvaluationCreateWithoutCourseInput, EvaluationUncheckedCreateWithoutCourseInput> | EvaluationCreateWithoutCourseInput[] | EvaluationUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: EvaluationCreateOrConnectWithoutCourseInput | EvaluationCreateOrConnectWithoutCourseInput[]
    upsert?: EvaluationUpsertWithWhereUniqueWithoutCourseInput | EvaluationUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: EvaluationCreateManyCourseInputEnvelope
    set?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    disconnect?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    delete?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    connect?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    update?: EvaluationUpdateWithWhereUniqueWithoutCourseInput | EvaluationUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: EvaluationUpdateManyWithWhereWithoutCourseInput | EvaluationUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: EvaluationScalarWhereInput | EvaluationScalarWhereInput[]
  }

  export type LessonUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<LessonCreateWithoutCourseInput, LessonUncheckedCreateWithoutCourseInput> | LessonCreateWithoutCourseInput[] | LessonUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutCourseInput | LessonCreateOrConnectWithoutCourseInput[]
    upsert?: LessonUpsertWithWhereUniqueWithoutCourseInput | LessonUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: LessonCreateManyCourseInputEnvelope
    set?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    disconnect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    delete?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    update?: LessonUpdateWithWhereUniqueWithoutCourseInput | LessonUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: LessonUpdateManyWithWhereWithoutCourseInput | LessonUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: LessonScalarWhereInput | LessonScalarWhereInput[]
  }

  export type InscriptionUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<InscriptionCreateWithoutCourseInput, InscriptionUncheckedCreateWithoutCourseInput> | InscriptionCreateWithoutCourseInput[] | InscriptionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: InscriptionCreateOrConnectWithoutCourseInput | InscriptionCreateOrConnectWithoutCourseInput[]
    upsert?: InscriptionUpsertWithWhereUniqueWithoutCourseInput | InscriptionUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: InscriptionCreateManyCourseInputEnvelope
    set?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    disconnect?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    delete?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    connect?: InscriptionWhereUniqueInput | InscriptionWhereUniqueInput[]
    update?: InscriptionUpdateWithWhereUniqueWithoutCourseInput | InscriptionUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: InscriptionUpdateManyWithWhereWithoutCourseInput | InscriptionUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: InscriptionScalarWhereInput | InscriptionScalarWhereInput[]
  }

  export type EvaluationUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<EvaluationCreateWithoutCourseInput, EvaluationUncheckedCreateWithoutCourseInput> | EvaluationCreateWithoutCourseInput[] | EvaluationUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: EvaluationCreateOrConnectWithoutCourseInput | EvaluationCreateOrConnectWithoutCourseInput[]
    upsert?: EvaluationUpsertWithWhereUniqueWithoutCourseInput | EvaluationUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: EvaluationCreateManyCourseInputEnvelope
    set?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    disconnect?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    delete?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    connect?: EvaluationWhereUniqueInput | EvaluationWhereUniqueInput[]
    update?: EvaluationUpdateWithWhereUniqueWithoutCourseInput | EvaluationUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: EvaluationUpdateManyWithWhereWithoutCourseInput | EvaluationUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: EvaluationScalarWhereInput | EvaluationScalarWhereInput[]
  }

  export type CourseCreateNestedOneWithoutLessonsInput = {
    create?: XOR<CourseCreateWithoutLessonsInput, CourseUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: CourseCreateOrConnectWithoutLessonsInput
    connect?: CourseWhereUniqueInput
  }

  export type CalificationCreateNestedManyWithoutLessonInput = {
    create?: XOR<CalificationCreateWithoutLessonInput, CalificationUncheckedCreateWithoutLessonInput> | CalificationCreateWithoutLessonInput[] | CalificationUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: CalificationCreateOrConnectWithoutLessonInput | CalificationCreateOrConnectWithoutLessonInput[]
    createMany?: CalificationCreateManyLessonInputEnvelope
    connect?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
  }

  export type CalificationUncheckedCreateNestedManyWithoutLessonInput = {
    create?: XOR<CalificationCreateWithoutLessonInput, CalificationUncheckedCreateWithoutLessonInput> | CalificationCreateWithoutLessonInput[] | CalificationUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: CalificationCreateOrConnectWithoutLessonInput | CalificationCreateOrConnectWithoutLessonInput[]
    createMany?: CalificationCreateManyLessonInputEnvelope
    connect?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
  }

  export type CourseUpdateOneRequiredWithoutLessonsNestedInput = {
    create?: XOR<CourseCreateWithoutLessonsInput, CourseUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: CourseCreateOrConnectWithoutLessonsInput
    upsert?: CourseUpsertWithoutLessonsInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutLessonsInput, CourseUpdateWithoutLessonsInput>, CourseUncheckedUpdateWithoutLessonsInput>
  }

  export type CalificationUpdateManyWithoutLessonNestedInput = {
    create?: XOR<CalificationCreateWithoutLessonInput, CalificationUncheckedCreateWithoutLessonInput> | CalificationCreateWithoutLessonInput[] | CalificationUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: CalificationCreateOrConnectWithoutLessonInput | CalificationCreateOrConnectWithoutLessonInput[]
    upsert?: CalificationUpsertWithWhereUniqueWithoutLessonInput | CalificationUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: CalificationCreateManyLessonInputEnvelope
    set?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    disconnect?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    delete?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    connect?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    update?: CalificationUpdateWithWhereUniqueWithoutLessonInput | CalificationUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: CalificationUpdateManyWithWhereWithoutLessonInput | CalificationUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: CalificationScalarWhereInput | CalificationScalarWhereInput[]
  }

  export type CalificationUncheckedUpdateManyWithoutLessonNestedInput = {
    create?: XOR<CalificationCreateWithoutLessonInput, CalificationUncheckedCreateWithoutLessonInput> | CalificationCreateWithoutLessonInput[] | CalificationUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: CalificationCreateOrConnectWithoutLessonInput | CalificationCreateOrConnectWithoutLessonInput[]
    upsert?: CalificationUpsertWithWhereUniqueWithoutLessonInput | CalificationUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: CalificationCreateManyLessonInputEnvelope
    set?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    disconnect?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    delete?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    connect?: CalificationWhereUniqueInput | CalificationWhereUniqueInput[]
    update?: CalificationUpdateWithWhereUniqueWithoutLessonInput | CalificationUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: CalificationUpdateManyWithWhereWithoutLessonInput | CalificationUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: CalificationScalarWhereInput | CalificationScalarWhereInput[]
  }

  export type CourseCreateNestedOneWithoutInscriptionsInput = {
    create?: XOR<CourseCreateWithoutInscriptionsInput, CourseUncheckedCreateWithoutInscriptionsInput>
    connectOrCreate?: CourseCreateOrConnectWithoutInscriptionsInput
    connect?: CourseWhereUniqueInput
  }

  export type ProgressCreateNestedManyWithoutInscriptionInput = {
    create?: XOR<ProgressCreateWithoutInscriptionInput, ProgressUncheckedCreateWithoutInscriptionInput> | ProgressCreateWithoutInscriptionInput[] | ProgressUncheckedCreateWithoutInscriptionInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutInscriptionInput | ProgressCreateOrConnectWithoutInscriptionInput[]
    createMany?: ProgressCreateManyInscriptionInputEnvelope
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
  }

  export type ProgressUncheckedCreateNestedManyWithoutInscriptionInput = {
    create?: XOR<ProgressCreateWithoutInscriptionInput, ProgressUncheckedCreateWithoutInscriptionInput> | ProgressCreateWithoutInscriptionInput[] | ProgressUncheckedCreateWithoutInscriptionInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutInscriptionInput | ProgressCreateOrConnectWithoutInscriptionInput[]
    createMany?: ProgressCreateManyInscriptionInputEnvelope
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type CourseUpdateOneRequiredWithoutInscriptionsNestedInput = {
    create?: XOR<CourseCreateWithoutInscriptionsInput, CourseUncheckedCreateWithoutInscriptionsInput>
    connectOrCreate?: CourseCreateOrConnectWithoutInscriptionsInput
    upsert?: CourseUpsertWithoutInscriptionsInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutInscriptionsInput, CourseUpdateWithoutInscriptionsInput>, CourseUncheckedUpdateWithoutInscriptionsInput>
  }

  export type ProgressUpdateManyWithoutInscriptionNestedInput = {
    create?: XOR<ProgressCreateWithoutInscriptionInput, ProgressUncheckedCreateWithoutInscriptionInput> | ProgressCreateWithoutInscriptionInput[] | ProgressUncheckedCreateWithoutInscriptionInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutInscriptionInput | ProgressCreateOrConnectWithoutInscriptionInput[]
    upsert?: ProgressUpsertWithWhereUniqueWithoutInscriptionInput | ProgressUpsertWithWhereUniqueWithoutInscriptionInput[]
    createMany?: ProgressCreateManyInscriptionInputEnvelope
    set?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    disconnect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    delete?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    update?: ProgressUpdateWithWhereUniqueWithoutInscriptionInput | ProgressUpdateWithWhereUniqueWithoutInscriptionInput[]
    updateMany?: ProgressUpdateManyWithWhereWithoutInscriptionInput | ProgressUpdateManyWithWhereWithoutInscriptionInput[]
    deleteMany?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
  }

  export type ProgressUncheckedUpdateManyWithoutInscriptionNestedInput = {
    create?: XOR<ProgressCreateWithoutInscriptionInput, ProgressUncheckedCreateWithoutInscriptionInput> | ProgressCreateWithoutInscriptionInput[] | ProgressUncheckedCreateWithoutInscriptionInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutInscriptionInput | ProgressCreateOrConnectWithoutInscriptionInput[]
    upsert?: ProgressUpsertWithWhereUniqueWithoutInscriptionInput | ProgressUpsertWithWhereUniqueWithoutInscriptionInput[]
    createMany?: ProgressCreateManyInscriptionInputEnvelope
    set?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    disconnect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    delete?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    update?: ProgressUpdateWithWhereUniqueWithoutInscriptionInput | ProgressUpdateWithWhereUniqueWithoutInscriptionInput[]
    updateMany?: ProgressUpdateManyWithWhereWithoutInscriptionInput | ProgressUpdateManyWithWhereWithoutInscriptionInput[]
    deleteMany?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
  }

  export type InscriptionCreateNestedOneWithoutProgressInput = {
    create?: XOR<InscriptionCreateWithoutProgressInput, InscriptionUncheckedCreateWithoutProgressInput>
    connectOrCreate?: InscriptionCreateOrConnectWithoutProgressInput
    connect?: InscriptionWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type InscriptionUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<InscriptionCreateWithoutProgressInput, InscriptionUncheckedCreateWithoutProgressInput>
    connectOrCreate?: InscriptionCreateOrConnectWithoutProgressInput
    upsert?: InscriptionUpsertWithoutProgressInput
    connect?: InscriptionWhereUniqueInput
    update?: XOR<XOR<InscriptionUpdateToOneWithWhereWithoutProgressInput, InscriptionUpdateWithoutProgressInput>, InscriptionUncheckedUpdateWithoutProgressInput>
  }

  export type LessonCreateNestedOneWithoutCalificationsInput = {
    create?: XOR<LessonCreateWithoutCalificationsInput, LessonUncheckedCreateWithoutCalificationsInput>
    connectOrCreate?: LessonCreateOrConnectWithoutCalificationsInput
    connect?: LessonWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LessonUpdateOneRequiredWithoutCalificationsNestedInput = {
    create?: XOR<LessonCreateWithoutCalificationsInput, LessonUncheckedCreateWithoutCalificationsInput>
    connectOrCreate?: LessonCreateOrConnectWithoutCalificationsInput
    upsert?: LessonUpsertWithoutCalificationsInput
    connect?: LessonWhereUniqueInput
    update?: XOR<XOR<LessonUpdateToOneWithWhereWithoutCalificationsInput, LessonUpdateWithoutCalificationsInput>, LessonUncheckedUpdateWithoutCalificationsInput>
  }

  export type CourseCreateNestedOneWithoutEvaluationsInput = {
    create?: XOR<CourseCreateWithoutEvaluationsInput, CourseUncheckedCreateWithoutEvaluationsInput>
    connectOrCreate?: CourseCreateOrConnectWithoutEvaluationsInput
    connect?: CourseWhereUniqueInput
  }

  export type EvaluationAttemptCreateNestedManyWithoutEvaluationInput = {
    create?: XOR<EvaluationAttemptCreateWithoutEvaluationInput, EvaluationAttemptUncheckedCreateWithoutEvaluationInput> | EvaluationAttemptCreateWithoutEvaluationInput[] | EvaluationAttemptUncheckedCreateWithoutEvaluationInput[]
    connectOrCreate?: EvaluationAttemptCreateOrConnectWithoutEvaluationInput | EvaluationAttemptCreateOrConnectWithoutEvaluationInput[]
    createMany?: EvaluationAttemptCreateManyEvaluationInputEnvelope
    connect?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
  }

  export type EvaluationAttemptUncheckedCreateNestedManyWithoutEvaluationInput = {
    create?: XOR<EvaluationAttemptCreateWithoutEvaluationInput, EvaluationAttemptUncheckedCreateWithoutEvaluationInput> | EvaluationAttemptCreateWithoutEvaluationInput[] | EvaluationAttemptUncheckedCreateWithoutEvaluationInput[]
    connectOrCreate?: EvaluationAttemptCreateOrConnectWithoutEvaluationInput | EvaluationAttemptCreateOrConnectWithoutEvaluationInput[]
    createMany?: EvaluationAttemptCreateManyEvaluationInputEnvelope
    connect?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
  }

  export type CourseUpdateOneRequiredWithoutEvaluationsNestedInput = {
    create?: XOR<CourseCreateWithoutEvaluationsInput, CourseUncheckedCreateWithoutEvaluationsInput>
    connectOrCreate?: CourseCreateOrConnectWithoutEvaluationsInput
    upsert?: CourseUpsertWithoutEvaluationsInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutEvaluationsInput, CourseUpdateWithoutEvaluationsInput>, CourseUncheckedUpdateWithoutEvaluationsInput>
  }

  export type EvaluationAttemptUpdateManyWithoutEvaluationNestedInput = {
    create?: XOR<EvaluationAttemptCreateWithoutEvaluationInput, EvaluationAttemptUncheckedCreateWithoutEvaluationInput> | EvaluationAttemptCreateWithoutEvaluationInput[] | EvaluationAttemptUncheckedCreateWithoutEvaluationInput[]
    connectOrCreate?: EvaluationAttemptCreateOrConnectWithoutEvaluationInput | EvaluationAttemptCreateOrConnectWithoutEvaluationInput[]
    upsert?: EvaluationAttemptUpsertWithWhereUniqueWithoutEvaluationInput | EvaluationAttemptUpsertWithWhereUniqueWithoutEvaluationInput[]
    createMany?: EvaluationAttemptCreateManyEvaluationInputEnvelope
    set?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    disconnect?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    delete?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    connect?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    update?: EvaluationAttemptUpdateWithWhereUniqueWithoutEvaluationInput | EvaluationAttemptUpdateWithWhereUniqueWithoutEvaluationInput[]
    updateMany?: EvaluationAttemptUpdateManyWithWhereWithoutEvaluationInput | EvaluationAttemptUpdateManyWithWhereWithoutEvaluationInput[]
    deleteMany?: EvaluationAttemptScalarWhereInput | EvaluationAttemptScalarWhereInput[]
  }

  export type EvaluationAttemptUncheckedUpdateManyWithoutEvaluationNestedInput = {
    create?: XOR<EvaluationAttemptCreateWithoutEvaluationInput, EvaluationAttemptUncheckedCreateWithoutEvaluationInput> | EvaluationAttemptCreateWithoutEvaluationInput[] | EvaluationAttemptUncheckedCreateWithoutEvaluationInput[]
    connectOrCreate?: EvaluationAttemptCreateOrConnectWithoutEvaluationInput | EvaluationAttemptCreateOrConnectWithoutEvaluationInput[]
    upsert?: EvaluationAttemptUpsertWithWhereUniqueWithoutEvaluationInput | EvaluationAttemptUpsertWithWhereUniqueWithoutEvaluationInput[]
    createMany?: EvaluationAttemptCreateManyEvaluationInputEnvelope
    set?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    disconnect?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    delete?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    connect?: EvaluationAttemptWhereUniqueInput | EvaluationAttemptWhereUniqueInput[]
    update?: EvaluationAttemptUpdateWithWhereUniqueWithoutEvaluationInput | EvaluationAttemptUpdateWithWhereUniqueWithoutEvaluationInput[]
    updateMany?: EvaluationAttemptUpdateManyWithWhereWithoutEvaluationInput | EvaluationAttemptUpdateManyWithWhereWithoutEvaluationInput[]
    deleteMany?: EvaluationAttemptScalarWhereInput | EvaluationAttemptScalarWhereInput[]
  }

  export type EvaluationCreateNestedOneWithoutAttemptsInput = {
    create?: XOR<EvaluationCreateWithoutAttemptsInput, EvaluationUncheckedCreateWithoutAttemptsInput>
    connectOrCreate?: EvaluationCreateOrConnectWithoutAttemptsInput
    connect?: EvaluationWhereUniqueInput
  }

  export type EvaluationUpdateOneRequiredWithoutAttemptsNestedInput = {
    create?: XOR<EvaluationCreateWithoutAttemptsInput, EvaluationUncheckedCreateWithoutAttemptsInput>
    connectOrCreate?: EvaluationCreateOrConnectWithoutAttemptsInput
    upsert?: EvaluationUpsertWithoutAttemptsInput
    connect?: EvaluationWhereUniqueInput
    update?: XOR<XOR<EvaluationUpdateToOneWithWhereWithoutAttemptsInput, EvaluationUpdateWithoutAttemptsInput>, EvaluationUncheckedUpdateWithoutAttemptsInput>
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

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LessonCreateWithoutCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
    califications?: CalificationCreateNestedManyWithoutLessonInput
  }

  export type LessonUncheckedCreateWithoutCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
    califications?: CalificationUncheckedCreateNestedManyWithoutLessonInput
  }

  export type LessonCreateOrConnectWithoutCourseInput = {
    where: LessonWhereUniqueInput
    create: XOR<LessonCreateWithoutCourseInput, LessonUncheckedCreateWithoutCourseInput>
  }

  export type LessonCreateManyCourseInputEnvelope = {
    data: LessonCreateManyCourseInput | LessonCreateManyCourseInput[]
    skipDuplicates?: boolean
  }

  export type InscriptionCreateWithoutCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
    progress?: ProgressCreateNestedManyWithoutInscriptionInput
  }

  export type InscriptionUncheckedCreateWithoutCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
    progress?: ProgressUncheckedCreateNestedManyWithoutInscriptionInput
  }

  export type InscriptionCreateOrConnectWithoutCourseInput = {
    where: InscriptionWhereUniqueInput
    create: XOR<InscriptionCreateWithoutCourseInput, InscriptionUncheckedCreateWithoutCourseInput>
  }

  export type InscriptionCreateManyCourseInputEnvelope = {
    data: InscriptionCreateManyCourseInput | InscriptionCreateManyCourseInput[]
    skipDuplicates?: boolean
  }

  export type EvaluationCreateWithoutCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
    attempts?: EvaluationAttemptCreateNestedManyWithoutEvaluationInput
  }

  export type EvaluationUncheckedCreateWithoutCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
    attempts?: EvaluationAttemptUncheckedCreateNestedManyWithoutEvaluationInput
  }

  export type EvaluationCreateOrConnectWithoutCourseInput = {
    where: EvaluationWhereUniqueInput
    create: XOR<EvaluationCreateWithoutCourseInput, EvaluationUncheckedCreateWithoutCourseInput>
  }

  export type EvaluationCreateManyCourseInputEnvelope = {
    data: EvaluationCreateManyCourseInput | EvaluationCreateManyCourseInput[]
    skipDuplicates?: boolean
  }

  export type LessonUpsertWithWhereUniqueWithoutCourseInput = {
    where: LessonWhereUniqueInput
    update: XOR<LessonUpdateWithoutCourseInput, LessonUncheckedUpdateWithoutCourseInput>
    create: XOR<LessonCreateWithoutCourseInput, LessonUncheckedCreateWithoutCourseInput>
  }

  export type LessonUpdateWithWhereUniqueWithoutCourseInput = {
    where: LessonWhereUniqueInput
    data: XOR<LessonUpdateWithoutCourseInput, LessonUncheckedUpdateWithoutCourseInput>
  }

  export type LessonUpdateManyWithWhereWithoutCourseInput = {
    where: LessonScalarWhereInput
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyWithoutCourseInput>
  }

  export type LessonScalarWhereInput = {
    AND?: LessonScalarWhereInput | LessonScalarWhereInput[]
    OR?: LessonScalarWhereInput[]
    NOT?: LessonScalarWhereInput | LessonScalarWhereInput[]
    id?: UuidFilter<"Lesson"> | string
    transactionDate?: DateTimeFilter<"Lesson"> | Date | string
    startDate?: DateTimeNullableFilter<"Lesson"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Lesson"> | Date | string | null
    createdBy?: StringNullableFilter<"Lesson"> | string | null
    updatedBy?: StringNullableFilter<"Lesson"> | string | null
    createdAt?: DateTimeFilter<"Lesson"> | Date | string
    updatedAt?: DateTimeFilter<"Lesson"> | Date | string
    title?: StringFilter<"Lesson"> | string
    content?: StringFilter<"Lesson"> | string
    contentType?: StringFilter<"Lesson"> | string
    courseId?: UuidFilter<"Lesson"> | string
  }

  export type InscriptionUpsertWithWhereUniqueWithoutCourseInput = {
    where: InscriptionWhereUniqueInput
    update: XOR<InscriptionUpdateWithoutCourseInput, InscriptionUncheckedUpdateWithoutCourseInput>
    create: XOR<InscriptionCreateWithoutCourseInput, InscriptionUncheckedCreateWithoutCourseInput>
  }

  export type InscriptionUpdateWithWhereUniqueWithoutCourseInput = {
    where: InscriptionWhereUniqueInput
    data: XOR<InscriptionUpdateWithoutCourseInput, InscriptionUncheckedUpdateWithoutCourseInput>
  }

  export type InscriptionUpdateManyWithWhereWithoutCourseInput = {
    where: InscriptionScalarWhereInput
    data: XOR<InscriptionUpdateManyMutationInput, InscriptionUncheckedUpdateManyWithoutCourseInput>
  }

  export type InscriptionScalarWhereInput = {
    AND?: InscriptionScalarWhereInput | InscriptionScalarWhereInput[]
    OR?: InscriptionScalarWhereInput[]
    NOT?: InscriptionScalarWhereInput | InscriptionScalarWhereInput[]
    id?: UuidFilter<"Inscription"> | string
    transactionDate?: DateTimeFilter<"Inscription"> | Date | string
    startDate?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Inscription"> | Date | string | null
    createdBy?: StringNullableFilter<"Inscription"> | string | null
    updatedBy?: StringNullableFilter<"Inscription"> | string | null
    createdAt?: DateTimeFilter<"Inscription"> | Date | string
    updatedAt?: DateTimeFilter<"Inscription"> | Date | string
    userId?: UuidFilter<"Inscription"> | string
    courseId?: UuidFilter<"Inscription"> | string
    status?: StringFilter<"Inscription"> | string
    progressPercentage?: DecimalNullableFilter<"Inscription"> | Decimal | DecimalJsLike | number | string | null
    completedAt?: DateTimeNullableFilter<"Inscription"> | Date | string | null
  }

  export type EvaluationUpsertWithWhereUniqueWithoutCourseInput = {
    where: EvaluationWhereUniqueInput
    update: XOR<EvaluationUpdateWithoutCourseInput, EvaluationUncheckedUpdateWithoutCourseInput>
    create: XOR<EvaluationCreateWithoutCourseInput, EvaluationUncheckedCreateWithoutCourseInput>
  }

  export type EvaluationUpdateWithWhereUniqueWithoutCourseInput = {
    where: EvaluationWhereUniqueInput
    data: XOR<EvaluationUpdateWithoutCourseInput, EvaluationUncheckedUpdateWithoutCourseInput>
  }

  export type EvaluationUpdateManyWithWhereWithoutCourseInput = {
    where: EvaluationScalarWhereInput
    data: XOR<EvaluationUpdateManyMutationInput, EvaluationUncheckedUpdateManyWithoutCourseInput>
  }

  export type EvaluationScalarWhereInput = {
    AND?: EvaluationScalarWhereInput | EvaluationScalarWhereInput[]
    OR?: EvaluationScalarWhereInput[]
    NOT?: EvaluationScalarWhereInput | EvaluationScalarWhereInput[]
    id?: UuidFilter<"Evaluation"> | string
    transactionDate?: DateTimeFilter<"Evaluation"> | Date | string
    startDate?: DateTimeNullableFilter<"Evaluation"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Evaluation"> | Date | string | null
    createdBy?: StringNullableFilter<"Evaluation"> | string | null
    updatedBy?: StringNullableFilter<"Evaluation"> | string | null
    createdAt?: DateTimeFilter<"Evaluation"> | Date | string
    updatedAt?: DateTimeFilter<"Evaluation"> | Date | string
    title?: StringFilter<"Evaluation"> | string
    description?: StringNullableFilter<"Evaluation"> | string | null
    courseId?: UuidFilter<"Evaluation"> | string
  }

  export type CourseCreateWithoutLessonsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    inscriptions?: InscriptionCreateNestedManyWithoutCourseInput
    evaluations?: EvaluationCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutLessonsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    inscriptions?: InscriptionUncheckedCreateNestedManyWithoutCourseInput
    evaluations?: EvaluationUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutLessonsInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutLessonsInput, CourseUncheckedCreateWithoutLessonsInput>
  }

  export type CalificationCreateWithoutLessonInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    type?: string
    totalPoints?: number
    maxAttempts?: number
  }

  export type CalificationUncheckedCreateWithoutLessonInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    type?: string
    totalPoints?: number
    maxAttempts?: number
  }

  export type CalificationCreateOrConnectWithoutLessonInput = {
    where: CalificationWhereUniqueInput
    create: XOR<CalificationCreateWithoutLessonInput, CalificationUncheckedCreateWithoutLessonInput>
  }

  export type CalificationCreateManyLessonInputEnvelope = {
    data: CalificationCreateManyLessonInput | CalificationCreateManyLessonInput[]
    skipDuplicates?: boolean
  }

  export type CourseUpsertWithoutLessonsInput = {
    update: XOR<CourseUpdateWithoutLessonsInput, CourseUncheckedUpdateWithoutLessonsInput>
    create: XOR<CourseCreateWithoutLessonsInput, CourseUncheckedCreateWithoutLessonsInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutLessonsInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutLessonsInput, CourseUncheckedUpdateWithoutLessonsInput>
  }

  export type CourseUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    inscriptions?: InscriptionUpdateManyWithoutCourseNestedInput
    evaluations?: EvaluationUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    inscriptions?: InscriptionUncheckedUpdateManyWithoutCourseNestedInput
    evaluations?: EvaluationUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type CalificationUpsertWithWhereUniqueWithoutLessonInput = {
    where: CalificationWhereUniqueInput
    update: XOR<CalificationUpdateWithoutLessonInput, CalificationUncheckedUpdateWithoutLessonInput>
    create: XOR<CalificationCreateWithoutLessonInput, CalificationUncheckedCreateWithoutLessonInput>
  }

  export type CalificationUpdateWithWhereUniqueWithoutLessonInput = {
    where: CalificationWhereUniqueInput
    data: XOR<CalificationUpdateWithoutLessonInput, CalificationUncheckedUpdateWithoutLessonInput>
  }

  export type CalificationUpdateManyWithWhereWithoutLessonInput = {
    where: CalificationScalarWhereInput
    data: XOR<CalificationUpdateManyMutationInput, CalificationUncheckedUpdateManyWithoutLessonInput>
  }

  export type CalificationScalarWhereInput = {
    AND?: CalificationScalarWhereInput | CalificationScalarWhereInput[]
    OR?: CalificationScalarWhereInput[]
    NOT?: CalificationScalarWhereInput | CalificationScalarWhereInput[]
    id?: UuidFilter<"Calification"> | string
    transactionDate?: DateTimeFilter<"Calification"> | Date | string
    startDate?: DateTimeNullableFilter<"Calification"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Calification"> | Date | string | null
    createdBy?: StringNullableFilter<"Calification"> | string | null
    updatedBy?: StringNullableFilter<"Calification"> | string | null
    createdAt?: DateTimeFilter<"Calification"> | Date | string
    updatedAt?: DateTimeFilter<"Calification"> | Date | string
    title?: StringFilter<"Calification"> | string
    content?: StringFilter<"Calification"> | string
    type?: StringFilter<"Calification"> | string
    totalPoints?: IntFilter<"Calification"> | number
    maxAttempts?: IntFilter<"Calification"> | number
    lessonId?: UuidFilter<"Calification"> | string
  }

  export type CourseCreateWithoutInscriptionsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    lessons?: LessonCreateNestedManyWithoutCourseInput
    evaluations?: EvaluationCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutInscriptionsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    lessons?: LessonUncheckedCreateNestedManyWithoutCourseInput
    evaluations?: EvaluationUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutInscriptionsInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutInscriptionsInput, CourseUncheckedCreateWithoutInscriptionsInput>
  }

  export type ProgressCreateWithoutInscriptionInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lessonsCompleted?: Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: Decimal | DecimalJsLike | number | string
    averageScore?: Decimal | DecimalJsLike | number | string
    progressPercentage?: Decimal | DecimalJsLike | number | string
    lastAccessAt?: Date | string | null
  }

  export type ProgressUncheckedCreateWithoutInscriptionInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lessonsCompleted?: Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: Decimal | DecimalJsLike | number | string
    averageScore?: Decimal | DecimalJsLike | number | string
    progressPercentage?: Decimal | DecimalJsLike | number | string
    lastAccessAt?: Date | string | null
  }

  export type ProgressCreateOrConnectWithoutInscriptionInput = {
    where: ProgressWhereUniqueInput
    create: XOR<ProgressCreateWithoutInscriptionInput, ProgressUncheckedCreateWithoutInscriptionInput>
  }

  export type ProgressCreateManyInscriptionInputEnvelope = {
    data: ProgressCreateManyInscriptionInput | ProgressCreateManyInscriptionInput[]
    skipDuplicates?: boolean
  }

  export type CourseUpsertWithoutInscriptionsInput = {
    update: XOR<CourseUpdateWithoutInscriptionsInput, CourseUncheckedUpdateWithoutInscriptionsInput>
    create: XOR<CourseCreateWithoutInscriptionsInput, CourseUncheckedCreateWithoutInscriptionsInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutInscriptionsInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutInscriptionsInput, CourseUncheckedUpdateWithoutInscriptionsInput>
  }

  export type CourseUpdateWithoutInscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    lessons?: LessonUpdateManyWithoutCourseNestedInput
    evaluations?: EvaluationUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutInscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    lessons?: LessonUncheckedUpdateManyWithoutCourseNestedInput
    evaluations?: EvaluationUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type ProgressUpsertWithWhereUniqueWithoutInscriptionInput = {
    where: ProgressWhereUniqueInput
    update: XOR<ProgressUpdateWithoutInscriptionInput, ProgressUncheckedUpdateWithoutInscriptionInput>
    create: XOR<ProgressCreateWithoutInscriptionInput, ProgressUncheckedCreateWithoutInscriptionInput>
  }

  export type ProgressUpdateWithWhereUniqueWithoutInscriptionInput = {
    where: ProgressWhereUniqueInput
    data: XOR<ProgressUpdateWithoutInscriptionInput, ProgressUncheckedUpdateWithoutInscriptionInput>
  }

  export type ProgressUpdateManyWithWhereWithoutInscriptionInput = {
    where: ProgressScalarWhereInput
    data: XOR<ProgressUpdateManyMutationInput, ProgressUncheckedUpdateManyWithoutInscriptionInput>
  }

  export type ProgressScalarWhereInput = {
    AND?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
    OR?: ProgressScalarWhereInput[]
    NOT?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
    id?: UuidFilter<"Progress"> | string
    transactionDate?: DateTimeFilter<"Progress"> | Date | string
    startDate?: DateTimeNullableFilter<"Progress"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Progress"> | Date | string | null
    createdBy?: StringNullableFilter<"Progress"> | string | null
    updatedBy?: StringNullableFilter<"Progress"> | string | null
    createdAt?: DateTimeFilter<"Progress"> | Date | string
    updatedAt?: DateTimeFilter<"Progress"> | Date | string
    inscriptionId?: UuidFilter<"Progress"> | string
    lessonsCompleted?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFilter<"Progress"> | Decimal | DecimalJsLike | number | string
    lastAccessAt?: DateTimeNullableFilter<"Progress"> | Date | string | null
  }

  export type InscriptionCreateWithoutProgressInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
    course: CourseCreateNestedOneWithoutInscriptionsInput
  }

  export type InscriptionUncheckedCreateWithoutProgressInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
  }

  export type InscriptionCreateOrConnectWithoutProgressInput = {
    where: InscriptionWhereUniqueInput
    create: XOR<InscriptionCreateWithoutProgressInput, InscriptionUncheckedCreateWithoutProgressInput>
  }

  export type InscriptionUpsertWithoutProgressInput = {
    update: XOR<InscriptionUpdateWithoutProgressInput, InscriptionUncheckedUpdateWithoutProgressInput>
    create: XOR<InscriptionCreateWithoutProgressInput, InscriptionUncheckedCreateWithoutProgressInput>
    where?: InscriptionWhereInput
  }

  export type InscriptionUpdateToOneWithWhereWithoutProgressInput = {
    where?: InscriptionWhereInput
    data: XOR<InscriptionUpdateWithoutProgressInput, InscriptionUncheckedUpdateWithoutProgressInput>
  }

  export type InscriptionUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    course?: CourseUpdateOneRequiredWithoutInscriptionsNestedInput
  }

  export type InscriptionUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LessonCreateWithoutCalificationsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
    course: CourseCreateNestedOneWithoutLessonsInput
  }

  export type LessonUncheckedCreateWithoutCalificationsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
    courseId: string
  }

  export type LessonCreateOrConnectWithoutCalificationsInput = {
    where: LessonWhereUniqueInput
    create: XOR<LessonCreateWithoutCalificationsInput, LessonUncheckedCreateWithoutCalificationsInput>
  }

  export type LessonUpsertWithoutCalificationsInput = {
    update: XOR<LessonUpdateWithoutCalificationsInput, LessonUncheckedUpdateWithoutCalificationsInput>
    create: XOR<LessonCreateWithoutCalificationsInput, LessonUncheckedCreateWithoutCalificationsInput>
    where?: LessonWhereInput
  }

  export type LessonUpdateToOneWithWhereWithoutCalificationsInput = {
    where?: LessonWhereInput
    data: XOR<LessonUpdateWithoutCalificationsInput, LessonUncheckedUpdateWithoutCalificationsInput>
  }

  export type LessonUpdateWithoutCalificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    course?: CourseUpdateOneRequiredWithoutLessonsNestedInput
  }

  export type LessonUncheckedUpdateWithoutCalificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseCreateWithoutEvaluationsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    lessons?: LessonCreateNestedManyWithoutCourseInput
    inscriptions?: InscriptionCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutEvaluationsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description: string
    status?: string
    level?: string
    lessons?: LessonUncheckedCreateNestedManyWithoutCourseInput
    inscriptions?: InscriptionUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutEvaluationsInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutEvaluationsInput, CourseUncheckedCreateWithoutEvaluationsInput>
  }

  export type EvaluationAttemptCreateWithoutEvaluationInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    studentId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptUncheckedCreateWithoutEvaluationInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    studentId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptCreateOrConnectWithoutEvaluationInput = {
    where: EvaluationAttemptWhereUniqueInput
    create: XOR<EvaluationAttemptCreateWithoutEvaluationInput, EvaluationAttemptUncheckedCreateWithoutEvaluationInput>
  }

  export type EvaluationAttemptCreateManyEvaluationInputEnvelope = {
    data: EvaluationAttemptCreateManyEvaluationInput | EvaluationAttemptCreateManyEvaluationInput[]
    skipDuplicates?: boolean
  }

  export type CourseUpsertWithoutEvaluationsInput = {
    update: XOR<CourseUpdateWithoutEvaluationsInput, CourseUncheckedUpdateWithoutEvaluationsInput>
    create: XOR<CourseCreateWithoutEvaluationsInput, CourseUncheckedCreateWithoutEvaluationsInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutEvaluationsInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutEvaluationsInput, CourseUncheckedUpdateWithoutEvaluationsInput>
  }

  export type CourseUpdateWithoutEvaluationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    lessons?: LessonUpdateManyWithoutCourseNestedInput
    inscriptions?: InscriptionUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutEvaluationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    lessons?: LessonUncheckedUpdateManyWithoutCourseNestedInput
    inscriptions?: InscriptionUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type EvaluationAttemptUpsertWithWhereUniqueWithoutEvaluationInput = {
    where: EvaluationAttemptWhereUniqueInput
    update: XOR<EvaluationAttemptUpdateWithoutEvaluationInput, EvaluationAttemptUncheckedUpdateWithoutEvaluationInput>
    create: XOR<EvaluationAttemptCreateWithoutEvaluationInput, EvaluationAttemptUncheckedCreateWithoutEvaluationInput>
  }

  export type EvaluationAttemptUpdateWithWhereUniqueWithoutEvaluationInput = {
    where: EvaluationAttemptWhereUniqueInput
    data: XOR<EvaluationAttemptUpdateWithoutEvaluationInput, EvaluationAttemptUncheckedUpdateWithoutEvaluationInput>
  }

  export type EvaluationAttemptUpdateManyWithWhereWithoutEvaluationInput = {
    where: EvaluationAttemptScalarWhereInput
    data: XOR<EvaluationAttemptUpdateManyMutationInput, EvaluationAttemptUncheckedUpdateManyWithoutEvaluationInput>
  }

  export type EvaluationAttemptScalarWhereInput = {
    AND?: EvaluationAttemptScalarWhereInput | EvaluationAttemptScalarWhereInput[]
    OR?: EvaluationAttemptScalarWhereInput[]
    NOT?: EvaluationAttemptScalarWhereInput | EvaluationAttemptScalarWhereInput[]
    id?: UuidFilter<"EvaluationAttempt"> | string
    transactionDate?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    startDate?: DateTimeNullableFilter<"EvaluationAttempt"> | Date | string | null
    endDate?: DateTimeNullableFilter<"EvaluationAttempt"> | Date | string | null
    createdBy?: StringNullableFilter<"EvaluationAttempt"> | string | null
    updatedBy?: StringNullableFilter<"EvaluationAttempt"> | string | null
    createdAt?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    updatedAt?: DateTimeFilter<"EvaluationAttempt"> | Date | string
    evaluationId?: UuidFilter<"EvaluationAttempt"> | string
    studentId?: UuidFilter<"EvaluationAttempt"> | string
    answers?: JsonFilter<"EvaluationAttempt">
    score?: DecimalNullableFilter<"EvaluationAttempt"> | Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationCreateWithoutAttemptsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
    course: CourseCreateNestedOneWithoutEvaluationsInput
  }

  export type EvaluationUncheckedCreateWithoutAttemptsInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
    courseId: string
  }

  export type EvaluationCreateOrConnectWithoutAttemptsInput = {
    where: EvaluationWhereUniqueInput
    create: XOR<EvaluationCreateWithoutAttemptsInput, EvaluationUncheckedCreateWithoutAttemptsInput>
  }

  export type EvaluationUpsertWithoutAttemptsInput = {
    update: XOR<EvaluationUpdateWithoutAttemptsInput, EvaluationUncheckedUpdateWithoutAttemptsInput>
    create: XOR<EvaluationCreateWithoutAttemptsInput, EvaluationUncheckedCreateWithoutAttemptsInput>
    where?: EvaluationWhereInput
  }

  export type EvaluationUpdateToOneWithWhereWithoutAttemptsInput = {
    where?: EvaluationWhereInput
    data: XOR<EvaluationUpdateWithoutAttemptsInput, EvaluationUncheckedUpdateWithoutAttemptsInput>
  }

  export type EvaluationUpdateWithoutAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    course?: CourseUpdateOneRequiredWithoutEvaluationsNestedInput
  }

  export type EvaluationUncheckedUpdateWithoutAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type LessonCreateManyCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    contentType?: string
  }

  export type InscriptionCreateManyCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    status?: string
    progressPercentage?: Decimal | DecimalJsLike | number | string | null
    completedAt?: Date | string | null
  }

  export type EvaluationCreateManyCourseInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    description?: string | null
  }

  export type LessonUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    califications?: CalificationUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    califications?: CalificationUncheckedUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
  }

  export type InscriptionUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progress?: ProgressUpdateManyWithoutInscriptionNestedInput
  }

  export type InscriptionUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progress?: ProgressUncheckedUpdateManyWithoutInscriptionNestedInput
  }

  export type InscriptionUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progressPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EvaluationUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attempts?: EvaluationAttemptUpdateManyWithoutEvaluationNestedInput
  }

  export type EvaluationUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attempts?: EvaluationAttemptUncheckedUpdateManyWithoutEvaluationNestedInput
  }

  export type EvaluationUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CalificationCreateManyLessonInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    title: string
    content: string
    type?: string
    totalPoints?: number
    maxAttempts?: number
  }

  export type CalificationUpdateWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
  }

  export type CalificationUncheckedUpdateWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
  }

  export type CalificationUncheckedUpdateManyWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
  }

  export type ProgressCreateManyInscriptionInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lessonsCompleted?: Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: Decimal | DecimalJsLike | number | string
    averageScore?: Decimal | DecimalJsLike | number | string
    progressPercentage?: Decimal | DecimalJsLike | number | string
    lastAccessAt?: Date | string | null
  }

  export type ProgressUpdateWithoutInscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessonsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressUncheckedUpdateWithoutInscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessonsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressUncheckedUpdateManyWithoutInscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessonsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    evaluationsCompleted?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    averageScore?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    progressPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastAccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EvaluationAttemptCreateManyEvaluationInput = {
    id?: string
    transactionDate?: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    studentId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptUpdateWithoutEvaluationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptUncheckedUpdateWithoutEvaluationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type EvaluationAttemptUncheckedUpdateManyWithoutEvaluationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
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