This package adds a context-tracking parser atop [commonform-markup-content-parse](https://npmjs.com/packages/commonform-markup-content-parse) for parsing multiline markup files representing multiple complex common forms. It passes [commonform-markup-tests](https://npmjs.com/packages/commonform-markup-tests)' suite.

For example:

```commonform
Preamble \\ This Agreement (this ""Agreement"") is made effective as of
[Effective Date] by and between [Seller's Legal Name] (""Seller"") and
[Buyer's Legal Name] (""Buyer"").

Definitions \\ For purposes of this <Agreement>, the following terms
have the following meanings:

    \\ ""Capital Stock"" means the capital stock of the Company,
including, without limitation, the <Common Stock> and the <Preferred
Stock>.

    \\ ""Dissolution Event"" means:

        \\ a voluntary termination of operations pursuant to {Voluntary
Shutdown};

        \\ a general assignment for the benefit of the <Company>'s
creditors or

        \\ any other liquidation, dissolution or winding up of the
<Company> (excluding a <Liquidity Event>), whether voluntary or
involuntary.
```

Each provision of the form begins with `\\`. If the provision has a heading, it goes before the slashes, like `Definitions \\ ...`. Subprovisions are set below their parent provisions by indenting with four spaces.

Within a provision, defined terms are set in `""double quotation marks""` and uses of defined terms are typed `<within angle brackets>`. A cross-reference to a provision with a `{Particular Heading}` is with braces. `[Blanks to be filled in]` use square brackets.
