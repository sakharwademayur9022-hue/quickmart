var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, l as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, m as lookupResultToBuffer, n as RequestStatusResponseStatus, U as UnknownError, o as RequestStatusDoneNoReplyErrorCode, p as RejectError, q as CertifiedRejectErrorCode, s as UNREACHABLE_ERROR, I as InputError, t as InvalidReadStateRequestErrorCode, v as ReadRequestType, w as Principal, x as IDL, y as MissingCanisterIdErrorCode, H as HttpAgent, z as encode, Q as QueryResponseStatus, A as UncertifiedRejectErrorCode, B as isV3ResponseBody, D as isV2ResponseBody, F as UncertifiedRejectUpdateErrorCode, G as UnexpectedErrorCode, J as decode, S as Subscribable, K as pendingThenable, N as resolveEnabled, O as shallowEqualObjects, V as resolveStaleTime, W as noop, X as environmentManager, Y as isValidTimeout, Z as timeUntilStale, _ as timeoutManager, $ as focusManager, a0 as fetchState, a1 as replaceData, a2 as notifyManager, a3 as hashKey, a4 as getDefaultState, r as reactExports, a5 as shouldThrowError, f as useQueryClient, a as useInternetIdentity, a6 as createActorWithConfig, a7 as useRouterState, j as jsxRuntimeExports, i as React, a8 as clsx, c as cn, a9 as Variant, aa as Record, ab as Vec, ac as Service, ad as Func, ae as Opt, af as Nat, ag as Text, ah as Bool, ai as Null, aj as Int, ak as Principal$1, d as ue, L as Link } from "./index-DJsfyEPD.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a2, _b2;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = createLucideIcon("menu", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const ProductId = Nat;
const Category = Variant({
  "Meat": Null,
  "Beverages": Null,
  "Dairy": Null,
  "Bakery": Null,
  "Household": Null,
  "PersonalCare": Null,
  "Vegetables": Null,
  "Snacks": Null,
  "Fruits": Null
});
const CreateProductRequest = Record({
  "inStock": Bool,
  "name": Text,
  "description": Text,
  "category": Category,
  "imageId": Text,
  "price": Nat
});
const Timestamp = Int;
const Product = Record({
  "id": ProductId,
  "inStock": Bool,
  "name": Text,
  "createdAt": Timestamp,
  "description": Text,
  "category": Category,
  "imageId": Text,
  "price": Nat
});
const OrderId = Nat;
const OrderStatus = Variant({
  "InTransit": Null,
  "Delivered": Null,
  "Confirmed": Null
});
const Address = Record({
  "tag": Text,
  "city": Text,
  "line1": Text,
  "line2": Text,
  "pincode": Text
});
const UserId = Principal$1;
const OrderItem = Record({
  "name": Text,
  "productId": ProductId,
  "quantity": Nat,
  "price": Nat
});
const OrderView = Record({
  "id": OrderId,
  "status": OrderStatus,
  "deliveryAddress": Address,
  "deliveryFee": Nat,
  "userId": UserId,
  "createdAt": Timestamp,
  "estimatedDelivery": Timestamp,
  "totalAmount": Nat,
  "items": Vec(OrderItem)
});
const CartItemView = Record({
  "productId": ProductId,
  "quantity": Nat
});
const UserProfile = Record({
  "id": UserId,
  "name": Text,
  "createdAt": Timestamp,
  "savedAddresses": Vec(Address),
  "email": Text,
  "isAdmin": Bool,
  "phone": Text
});
const PlaceOrderRequest = Record({ "deliveryAddress": Address });
const UpdateProfileRequest = Record({
  "name": Text,
  "savedAddresses": Vec(Address),
  "email": Text,
  "phone": Text
});
Service({
  "addToCart": Func([ProductId, Nat], [], []),
  "clearCart": Func([], [], []),
  "createProduct": Func([CreateProductRequest], [Product], []),
  "deleteProduct": Func([ProductId], [Bool], []),
  "getAllOrders": Func([], [Vec(OrderView)], ["query"]),
  "getAllProducts": Func([], [Vec(Product)], ["query"]),
  "getCart": Func([], [Vec(CartItemView)], ["query"]),
  "getMyOrders": Func([], [Vec(OrderView)], ["query"]),
  "getOrder": Func([OrderId], [Opt(OrderView)], ["query"]),
  "getProduct": Func([ProductId], [Opt(Product)], ["query"]),
  "getProductsByCategory": Func([Category], [Vec(Product)], ["query"]),
  "getProfile": Func([], [Opt(UserProfile)], []),
  "isAdmin": Func([], [Bool], ["query"]),
  "placeOrder": Func([PlaceOrderRequest], [OrderView], []),
  "removeFromCart": Func([ProductId], [], []),
  "searchProducts": Func([Text], [Vec(Product)], ["query"]),
  "seedProducts": Func([], [], []),
  "setAdminStatus": Func([UserId, Bool], [], []),
  "updateOrderStatus": Func(
    [OrderId, OrderStatus],
    [Opt(OrderView)],
    []
  ),
  "updateProduct": Func(
    [ProductId, CreateProductRequest],
    [Opt(Product)],
    []
  ),
  "updateProfile": Func([UpdateProfileRequest], [UserProfile], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const ProductId2 = IDL2.Nat;
  const Category2 = IDL2.Variant({
    "Meat": IDL2.Null,
    "Beverages": IDL2.Null,
    "Dairy": IDL2.Null,
    "Bakery": IDL2.Null,
    "Household": IDL2.Null,
    "PersonalCare": IDL2.Null,
    "Vegetables": IDL2.Null,
    "Snacks": IDL2.Null,
    "Fruits": IDL2.Null
  });
  const CreateProductRequest2 = IDL2.Record({
    "inStock": IDL2.Bool,
    "name": IDL2.Text,
    "description": IDL2.Text,
    "category": Category2,
    "imageId": IDL2.Text,
    "price": IDL2.Nat
  });
  const Timestamp2 = IDL2.Int;
  const Product2 = IDL2.Record({
    "id": ProductId2,
    "inStock": IDL2.Bool,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "description": IDL2.Text,
    "category": Category2,
    "imageId": IDL2.Text,
    "price": IDL2.Nat
  });
  const OrderId2 = IDL2.Nat;
  const OrderStatus2 = IDL2.Variant({
    "InTransit": IDL2.Null,
    "Delivered": IDL2.Null,
    "Confirmed": IDL2.Null
  });
  const Address2 = IDL2.Record({
    "tag": IDL2.Text,
    "city": IDL2.Text,
    "line1": IDL2.Text,
    "line2": IDL2.Text,
    "pincode": IDL2.Text
  });
  const UserId2 = IDL2.Principal;
  const OrderItem2 = IDL2.Record({
    "name": IDL2.Text,
    "productId": ProductId2,
    "quantity": IDL2.Nat,
    "price": IDL2.Nat
  });
  const OrderView2 = IDL2.Record({
    "id": OrderId2,
    "status": OrderStatus2,
    "deliveryAddress": Address2,
    "deliveryFee": IDL2.Nat,
    "userId": UserId2,
    "createdAt": Timestamp2,
    "estimatedDelivery": Timestamp2,
    "totalAmount": IDL2.Nat,
    "items": IDL2.Vec(OrderItem2)
  });
  const CartItemView2 = IDL2.Record({
    "productId": ProductId2,
    "quantity": IDL2.Nat
  });
  const UserProfile2 = IDL2.Record({
    "id": UserId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "savedAddresses": IDL2.Vec(Address2),
    "email": IDL2.Text,
    "isAdmin": IDL2.Bool,
    "phone": IDL2.Text
  });
  const PlaceOrderRequest2 = IDL2.Record({ "deliveryAddress": Address2 });
  const UpdateProfileRequest2 = IDL2.Record({
    "name": IDL2.Text,
    "savedAddresses": IDL2.Vec(Address2),
    "email": IDL2.Text,
    "phone": IDL2.Text
  });
  return IDL2.Service({
    "addToCart": IDL2.Func([ProductId2, IDL2.Nat], [], []),
    "clearCart": IDL2.Func([], [], []),
    "createProduct": IDL2.Func([CreateProductRequest2], [Product2], []),
    "deleteProduct": IDL2.Func([ProductId2], [IDL2.Bool], []),
    "getAllOrders": IDL2.Func([], [IDL2.Vec(OrderView2)], ["query"]),
    "getAllProducts": IDL2.Func([], [IDL2.Vec(Product2)], ["query"]),
    "getCart": IDL2.Func([], [IDL2.Vec(CartItemView2)], ["query"]),
    "getMyOrders": IDL2.Func([], [IDL2.Vec(OrderView2)], ["query"]),
    "getOrder": IDL2.Func([OrderId2], [IDL2.Opt(OrderView2)], ["query"]),
    "getProduct": IDL2.Func([ProductId2], [IDL2.Opt(Product2)], ["query"]),
    "getProductsByCategory": IDL2.Func(
      [Category2],
      [IDL2.Vec(Product2)],
      ["query"]
    ),
    "getProfile": IDL2.Func([], [IDL2.Opt(UserProfile2)], []),
    "isAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "placeOrder": IDL2.Func([PlaceOrderRequest2], [OrderView2], []),
    "removeFromCart": IDL2.Func([ProductId2], [], []),
    "searchProducts": IDL2.Func([IDL2.Text], [IDL2.Vec(Product2)], ["query"]),
    "seedProducts": IDL2.Func([], [], []),
    "setAdminStatus": IDL2.Func([UserId2, IDL2.Bool], [], []),
    "updateOrderStatus": IDL2.Func(
      [OrderId2, OrderStatus2],
      [IDL2.Opt(OrderView2)],
      []
    ),
    "updateProduct": IDL2.Func(
      [ProductId2, CreateProductRequest2],
      [IDL2.Opt(Product2)],
      []
    ),
    "updateProfile": IDL2.Func([UpdateProfileRequest2], [UserProfile2], [])
  });
};
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addToCart(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addToCart(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addToCart(arg0, arg1);
      return result;
    }
  }
  async clearCart() {
    if (this.processError) {
      try {
        const result = await this.actor.clearCart();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.clearCart();
      return result;
    }
  }
  async createProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createProduct(to_candid_CreateProductRequest_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid_Product_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createProduct(to_candid_CreateProductRequest_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid_Product_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteProduct(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteProduct(arg0);
      return result;
    }
  }
  async getAllOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllOrders();
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllOrders();
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllProducts() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllProducts();
        return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllProducts();
      return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCart() {
    if (this.processError) {
      try {
        const result = await this.actor.getCart();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCart();
      return result;
    }
  }
  async getMyOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyOrders();
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyOrders();
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getOrder(arg0);
        return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrder(arg0);
      return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProduct(arg0);
        return from_candid_opt_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProduct(arg0);
      return from_candid_opt_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProductsByCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProductsByCategory(to_candid_Category_n3(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProductsByCategory(to_candid_Category_n3(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getProfile();
        return from_candid_opt_n17(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProfile();
      return from_candid_opt_n17(this._uploadFile, this._downloadFile, result);
    }
  }
  async isAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isAdmin();
      return result;
    }
  }
  async placeOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.placeOrder(arg0);
        return from_candid_OrderView_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.placeOrder(arg0);
      return from_candid_OrderView_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeFromCart(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeFromCart(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeFromCart(arg0);
      return result;
    }
  }
  async searchProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchProducts(arg0);
        return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchProducts(arg0);
      return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
    }
  }
  async seedProducts() {
    if (this.processError) {
      try {
        const result = await this.actor.seedProducts();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.seedProducts();
      return result;
    }
  }
  async setAdminStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.setAdminStatus(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setAdminStatus(arg0, arg1);
      return result;
    }
  }
  async updateOrderStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateOrderStatus(arg0, to_candid_OrderStatus_n18(this._uploadFile, this._downloadFile, arg1));
        return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateOrderStatus(arg0, to_candid_OrderStatus_n18(this._uploadFile, this._downloadFile, arg1));
      return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateProduct(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateProduct(arg0, to_candid_CreateProductRequest_n1(this._uploadFile, this._downloadFile, arg1));
        return from_candid_opt_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateProduct(arg0, to_candid_CreateProductRequest_n1(this._uploadFile, this._downloadFile, arg1));
      return from_candid_opt_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateProfile(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateProfile(arg0);
      return result;
    }
  }
}
function from_candid_Category_n7(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n8(_uploadFile, _downloadFile, value);
}
function from_candid_OrderStatus_n12(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n13(_uploadFile, _downloadFile, value);
}
function from_candid_OrderView_n10(_uploadFile, _downloadFile, value) {
  return from_candid_record_n11(_uploadFile, _downloadFile, value);
}
function from_candid_Product_n5(_uploadFile, _downloadFile, value) {
  return from_candid_record_n6(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n15(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_OrderView_n10(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n16(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Product_n5(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n17(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n11(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_OrderStatus_n12(_uploadFile, _downloadFile, value.status),
    deliveryAddress: value.deliveryAddress,
    deliveryFee: value.deliveryFee,
    userId: value.userId,
    createdAt: value.createdAt,
    estimatedDelivery: value.estimatedDelivery,
    totalAmount: value.totalAmount,
    items: value.items
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    inStock: value.inStock,
    name: value.name,
    createdAt: value.createdAt,
    description: value.description,
    category: from_candid_Category_n7(_uploadFile, _downloadFile, value.category),
    imageId: value.imageId,
    price: value.price
  };
}
function from_candid_variant_n13(_uploadFile, _downloadFile, value) {
  return "InTransit" in value ? "InTransit" : "Delivered" in value ? "Delivered" : "Confirmed" in value ? "Confirmed" : value;
}
function from_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return "Meat" in value ? "Meat" : "Beverages" in value ? "Beverages" : "Dairy" in value ? "Dairy" : "Bakery" in value ? "Bakery" : "Household" in value ? "Household" : "PersonalCare" in value ? "PersonalCare" : "Vegetables" in value ? "Vegetables" : "Snacks" in value ? "Snacks" : "Fruits" in value ? "Fruits" : value;
}
function from_candid_vec_n14(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Product_n5(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n9(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_OrderView_n10(_uploadFile, _downloadFile, x));
}
function to_candid_Category_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_CreateProductRequest_n1(_uploadFile, _downloadFile, value) {
  return to_candid_record_n2(_uploadFile, _downloadFile, value);
}
function to_candid_OrderStatus_n18(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n19(_uploadFile, _downloadFile, value);
}
function to_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    inStock: value.inStock,
    name: value.name,
    description: value.description,
    category: to_candid_Category_n3(_uploadFile, _downloadFile, value.category),
    imageId: value.imageId,
    price: value.price
  };
}
function to_candid_variant_n19(_uploadFile, _downloadFile, value) {
  return value == "InTransit" ? {
    InTransit: null
  } : value == "Delivered" ? {
    Delivered: null
  } : value == "Confirmed" ? {
    Confirmed: null
  } : value;
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "Meat" ? {
    Meat: null
  } : value == "Beverages" ? {
    Beverages: null
  } : value == "Dairy" ? {
    Dairy: null
  } : value == "Bakery" ? {
    Bakery: null
  } : value == "Household" ? {
    Household: null
  } : value == "PersonalCare" ? {
    PersonalCare: null
  } : value == "Vegetables" ? {
    Vegetables: null
  } : value == "Snacks" ? {
    Snacks: null
  } : value == "Fruits" ? {
    Fruits: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useBackendActor() {
  return useActor(createActor);
}
function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorLoading } = useBackendActor();
  const isAuthenticated = loginStatus === "success" && !!identity;
  const isLoading = loginStatus === "logging-in" || actorLoading;
  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin", identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return false;
      return actor.isAdmin();
    },
    enabled: isAuthenticated && !!actor && !actorLoading
  });
  const { data: profile } = useQuery({
    queryKey: ["profile", identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      return actor.getProfile();
    },
    enabled: isAuthenticated && !!actor && !actorLoading
  });
  return {
    identity,
    isAuthenticated,
    isLoading,
    isAdmin,
    profile,
    login,
    logout: clear,
    principal: identity == null ? void 0 : identity.getPrincipal().toString()
  };
}
function useCart() {
  const { actor, isFetching: actorLoading } = useBackendActor();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
    staleTime: 1e4
  });
  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      ue.error("Failed to add item to cart");
    }
  });
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      ue.error("Failed to remove item from cart");
    }
  });
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
  const addToCart = (productId, productName, quantity = 1n) => {
    if (!isAuthenticated) return false;
    addToCartMutation.mutate({ productId, quantity });
    ue.success(`${productName} added to cart`, {
      duration: 2e3,
      icon: "🛒"
    });
    return true;
  };
  const removeFromCart = (productId) => {
    removeFromCartMutation.mutate(productId);
  };
  const clearCart = () => {
    clearCartMutation.mutate();
  };
  const itemCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );
  const getItemQuantity = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    return item ? Number(item.quantity) : 0;
  };
  return {
    cartItems,
    itemCount,
    isLoading,
    isAdding: addToCartMutation.isPending,
    addToCart,
    removeFromCart,
    clearCart,
    getItemQuantity
  };
}
const navItems = [
  { to: "/", label: "Home", icon: House },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/profile", label: "Account", icon: User }
];
function BottomNav() {
  const location = useLocation();
  const { itemCount } = useCart();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      className: "fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-card border-t border-border",
      "data-ocid": "bottom-nav",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-stretch h-16", children: navItems.map(({ to, label, icon: Icon2 }) => {
        const isActive = location.pathname === to || to !== "/" && location.pathname.startsWith(to);
        const isCart = to === "/cart";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to,
            className: cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            ),
            "data-ocid": `bottom-nav-${label.toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon2,
                  {
                    className: cn(
                      "w-5 h-5",
                      isActive && "scale-110 transition-transform"
                    )
                  }
                ),
                isCart && itemCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold px-0.5", children: itemCount > 99 ? "99+" : itemCount })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "text-[10px] font-medium",
                    isActive ? "text-primary" : ""
                  ),
                  children: label
                }
              ),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-b-full" })
            ]
          },
          to
        );
      }) })
    }
  );
}
function Layout({ children, className }) {
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin, login, logout } = useAuth();
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home", icon: House },
    { to: "/cart", label: "Cart", icon: ShoppingCart },
    { to: "/orders", label: "Orders", icon: ClipboardList },
    { to: "/profile", label: "Account", icon: User }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "header",
      {
        className: "sticky top-0 z-50 bg-card border-b border-border shadow-sm",
        "data-ocid": "header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground text-base font-black", children: "Z" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-lg text-foreground tracking-tight", children: "Zapkart" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted transition-colors text-sm text-foreground max-w-xs",
                type: "button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-primary shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-muted-foreground", children: "Deliver to" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold truncate", children: "Mumbai, 400001" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/",
                className: "hidden md:flex items-center gap-2 flex-1 max-w-md px-4 py-2 rounded-full border border-input bg-muted/40 hover:bg-muted transition-colors text-sm text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search for groceries, snacks…" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/admin",
                  className: "hidden sm:block text-xs font-semibold text-primary px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors",
                  children: "Admin"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/cart",
                  className: "relative p-2 hover:bg-muted rounded-full transition-colors",
                  "data-ocid": "cart-icon",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-5 h-5 text-foreground" }),
                    itemCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none px-1", children: itemCount > 99 ? "99+" : itemCount })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setMenuOpen(!menuOpen),
                  className: "p-2 hover:bg-muted rounded-full transition-colors sm:hidden",
                  "aria-label": "Toggle menu",
                  "data-ocid": "hamburger-menu",
                  children: menuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/profile",
                  className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-sm font-medium",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Account" })
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "default",
                size: "sm",
                className: "rounded-full px-4 font-semibold text-sm",
                onClick: login,
                "data-ocid": "login-btn",
                children: "Login"
              }
            ) })
          ] }),
          menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:hidden bg-card border-t border-border px-4 py-3 flex flex-col gap-1", children: [
            navLinks.map(({ to, label, icon: Icon2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to,
                onClick: () => setMenuOpen(false),
                className: cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === to ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "w-4 h-4" }),
                  label,
                  to === "/cart" && itemCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5", children: itemCount })
                ]
              },
              to
            )),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/admin",
                onClick: () => setMenuOpen(false),
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors",
                children: "Admin Panel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  logout();
                  setMenuOpen(false);
                },
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full",
                children: "Logout"
              }
            ) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn("flex-1 pb-20 sm:pb-6", className), children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  Button as B,
  ClipboardList as C,
  House as H,
  Layout as L,
  MapPin as M,
  ShoppingCart as S,
  User as U,
  X,
  useCart as a,
  Search as b,
  createLucideIcon as c,
  useBackendActor as d,
  useQuery as e,
  useMutation as f,
  useComposedRefs as g,
  buttonVariants as h,
  createSlot as i,
  composeRefs as j,
  Slot as k,
  cva as l,
  useAuth as u
};
