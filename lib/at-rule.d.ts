import Container = require('./container.js')

interface AtRuleRaws extends Record<string, unknown> {
  /**
   * The space symbols before the node. It also stores `*`
   * and `_` symbols before the declaration (IE hack).
   */
  before?: string

  /**
   * The space symbols after the last child of the node to the end of the node.
   */
  after?: string

  /**
   * The space between the at-rule name and its parameters.
   */
  afterName?: string

  /**
   * The symbols between the last parameter and `{` for rules.
   */
  between?: string

  /**
   * Contains `true` if the last child has an (optional) semicolon.
   */
  semicolon?: boolean

  /**
   * The rule’s selector with comments.
   */
  params?: {
    value: string
    raw: string
  }
}

declare namespace AtRule {
  interface AtRuleProps extends Container.ContainerProps {
    /** Name of the at-rule. */
    name: string
    /** Parameters following the name of the at-rule. */
    params?: string | number
    /** Information used to generate byte-to-byte equal node string as it was in the origin input. */
    raws?: AtRuleRaws
  }
}

interface AtRuleCtor {
  default: AtRuleCtor

  new (defaults?: AtRule.AtRuleProps): AtRule
}

/**
 * Represents an at-rule.
 *
 * ```js
 * Once (root, { AtRule }) {
 *   let media = new AtRule({ name: 'media', params: 'print' })
 *   media.append(…)
 *   root.append(media)
 * }
 * ```
 *
 * If it’s followed in the CSS by a {} block, this node will have
 * a nodes property representing its children.
 *
 * ```js
 * const root = postcss.parse('@charset "UTF-8"; @media print {}')
 *
 * const charset = root.first
 * charset.type  //=> 'atrule'
 * charset.nodes //=> undefined
 *
 * const media = root.last
 * media.nodes   //=> []
 * ```
 */
interface AtRule extends Container {
  type: 'atrule'
  parent: Container | undefined
  raws: AtRuleRaws

  /**
   * The at-rule’s name immediately follows the `@`.
   *
   * ```js
   * const root  = postcss.parse('@media print {}')
   * media.name //=> 'media'
   * const media = root.first
   * ```
   */
  name: string

  /**
   * The at-rule’s parameters, the values that follow the at-rule’s name
   * but precede any {} block.
   *
   * ```js
   * const root  = postcss.parse('@media print, screen {}')
   * const media = root.first
   * media.params //=> 'print, screen'
   * ```
   */
  params: string

  assign(overrides: object | AtRule.AtRuleProps): this
  clone(overrides?: Partial<AtRule.AtRuleProps>): this
  cloneBefore(overrides?: Partial<AtRule.AtRuleProps>): this
  cloneAfter(overrides?: Partial<AtRule.AtRuleProps>): this
}

declare const AtRule: AtRuleCtor

export = AtRule
