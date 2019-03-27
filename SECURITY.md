## Vulnerabilities in `harp`

It is possible that `harp` or its dependent libraries contain vulnerabilities
that would allow triggering unexpected or dangerous behavior with specially
crafted inputs.

### What is a vulnerability?

Since `harp` compiles web projects reading, writing, and deleting files is not
unexpected behavior and therefore is not a vulnerability in `harp`. Please only
submit file system conerns if you believe behaviour exists that is not intended
by the design of the software.

### Reporting vulnerabilities

Please email reports about any security related issues you find to
`brock@sintaxi.com`. Please use a descriptive subject line for your report
email. It's appreceated if you include a patch that fixes the security issue -
though that is not required.

In addition, please include the following information along with your report:

* Your name and affiliation (if any).
* A description of the technical details of the vulnerabilities. It is very
  important to include details on how how we can reproduce your findings.
* An explanation who can exploit this vulnerability, and what they gain when
  doing so -- write an attack scenario. This will help us evaluate your report
  quickly, especially if the issue is complex.
* Whether this vulnerability public or known to third parties. If it is, please
  provide details.

If you believe that an existing (public) issue is security-related, please send
an email to `brock@sintaxi.com`. The email should include the issue ID and a
short description of why it should be handled according to this security policy.

Once an issue is reported, `harp` uses the following process:

* When a report is received, we will determine its severity.
* Wherever possible, fixes are prepared for the last minor release of the two
  latest major releases, as well as the master branch. We will attempt to commit
  these fixes as soon as possible, and as close together as possible.
