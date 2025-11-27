/**
 * MCP Prompts - Reusable prompt templates
 *
 * Provides pre-built prompt templates for common workflows:
 * - Creating PRPs
 * - Code review
 * - TDD cycles
 * - Architecture decisions
 */

import { Prompt, PromptMessage } from "@modelcontextprotocol/sdk/types.js";

/**
 * Register all available prompts
 */
export function registerPrompts(): Prompt[] {
  return [
    {
      name: "create-prp",
      description:
        "Generate a Product Requirements Prompt (PRP) for a new feature",
      arguments: [
        {
          name: "feature_name",
          description: "Name of the feature",
          required: true,
        },
        {
          name: "description",
          description: "Brief description of what the feature should do",
          required: true,
        },
        {
          name: "tech_stack",
          description: "Technology stack constraints (optional)",
          required: false,
        },
      ],
    },
    {
      name: "code-review",
      description: "Perform a comprehensive code review",
      arguments: [
        {
          name: "files",
          description: "Files or directories to review",
          required: true,
        },
        {
          name: "focus",
          description:
            "Focus area: security, performance, quality, or all (default: all)",
          required: false,
        },
      ],
    },
    {
      name: "tdd-cycle",
      description: "Guide through a Test-Driven Development cycle",
      arguments: [
        {
          name: "feature",
          description: "Feature or functionality to implement",
          required: true,
        },
        {
          name: "test_framework",
          description: "Testing framework to use (default: auto-detect)",
          required: false,
        },
      ],
    },
    {
      name: "create-adr",
      description: "Create an Architecture Decision Record",
      arguments: [
        {
          name: "title",
          description: "Title of the architectural decision",
          required: true,
        },
        {
          name: "context",
          description: "Context and problem statement",
          required: true,
        },
        {
          name: "options",
          description: "Comma-separated list of options considered",
          required: false,
        },
      ],
    },
    {
      name: "refactor-safely",
      description: "Guide through safe refactoring with test coverage",
      arguments: [
        {
          name: "target",
          description: "Code to refactor (file, function, or module)",
          required: true,
        },
        {
          name: "goal",
          description: "Refactoring goal (e.g., extract method, simplify)",
          required: true,
        },
      ],
    },
    {
      name: "debug-issue",
      description: "Systematic debugging workflow",
      arguments: [
        {
          name: "symptom",
          description: "What is happening (the bug symptom)",
          required: true,
        },
        {
          name: "expected",
          description: "What should happen instead",
          required: true,
        },
        {
          name: "context",
          description: "Additional context (stack trace, logs, etc.)",
          required: false,
        },
      ],
    },
    {
      name: "implement-feature",
      description: "Full feature implementation workflow",
      arguments: [
        {
          name: "prp_name",
          description: "Name of the PRP to implement (or 'new' to create one)",
          required: true,
        },
      ],
    },
    {
      name: "security-audit",
      description: "Security-focused code audit",
      arguments: [
        {
          name: "scope",
          description: "What to audit (file, directory, or 'full')",
          required: true,
        },
        {
          name: "checklist",
          description:
            "Specific checks: owasp, auth, injection, all (default: all)",
          required: false,
        },
      ],
    },
  ];
}

/**
 * Get prompt content by name
 */
export function handlePromptGet(
  name: string,
  args?: Record<string, string>,
): { messages: PromptMessage[] } {
  switch (name) {
    case "create-prp":
      return createPRPPrompt(args);
    case "code-review":
      return codeReviewPrompt(args);
    case "tdd-cycle":
      return tddCyclePrompt(args);
    case "create-adr":
      return createADRPrompt(args);
    case "refactor-safely":
      return refactorSafelyPrompt(args);
    case "debug-issue":
      return debugIssuePrompt(args);
    case "implement-feature":
      return implementFeaturePrompt(args);
    case "security-audit":
      return securityAuditPrompt(args);
    default:
      return {
        messages: [
          {
            role: "user",
            content: { type: "text", text: `Unknown prompt: ${name}` },
          },
        ],
      };
  }
}

function createPRPPrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const featureName = args?.feature_name || "[FEATURE_NAME]";
  const description = args?.description || "[DESCRIPTION]";
  const techStack = args?.tech_stack || "auto-detect from project";

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a comprehensive Product Requirements Prompt (PRP) for the following feature:

## Feature: ${featureName}

## Description:
${description}

## Tech Stack Constraints:
${techStack}

---

Please create a PRP following this structure:

1. **Overview & Problem Statement**
   - What problem does this solve?
   - Who are the users?
   - What is the expected outcome?

2. **Functional Requirements**
   - Core functionality (must-have)
   - Nice-to-have features
   - Out of scope

3. **Non-Functional Requirements**
   - Performance expectations
   - Security considerations
   - Accessibility requirements

4. **Technical Approach**
   - Architecture overview
   - Key components
   - Integration points
   - Database changes (if any)

5. **Implementation Phases**
   - Phase 1: [Foundation]
   - Phase 2: [Core Features]
   - Phase 3: [Polish & Testing]

6. **Acceptance Criteria**
   - Testable criteria for completion
   - Definition of done

7. **Testing Strategy**
   - Unit tests
   - Integration tests
   - E2E tests (if applicable)

8. **Risks & Mitigations**
   - Potential blockers
   - Technical debt considerations

Use the search tools to understand the existing codebase patterns before finalizing the approach.`,
        },
      },
    ],
  };
}

function codeReviewPrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const files = args?.files || "[FILES_TO_REVIEW]";
  const focus = args?.focus || "all";

  const focusAreas =
    focus === "all"
      ? "security, performance, code quality, and best practices"
      : focus;

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Perform a comprehensive code review with focus on: ${focusAreas}

## Files to Review:
${files}

---

## Review Checklist:

### Code Quality
- [ ] Code follows project style guidelines
- [ ] Functions/methods are focused and small (<50 lines)
- [ ] No code duplication
- [ ] Clear naming conventions
- [ ] Appropriate error handling

### Security (if applicable)
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication/authorization checks

### Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] Proper caching strategy
- [ ] No memory leaks
- [ ] Lazy loading where appropriate

### Testing
- [ ] Unit tests present
- [ ] Edge cases covered
- [ ] Test names are descriptive
- [ ] Mocks used appropriately

### Documentation
- [ ] Complex logic is commented
- [ ] Public APIs are documented
- [ ] README updated if needed

Please provide specific line-by-line feedback with severity levels:
- 🔴 CRITICAL - Must fix before merge
- 🟠 WARNING - Should fix, creates technical debt
- 🟡 SUGGESTION - Nice to have improvement
- 🟢 PRAISE - Well done, good pattern to follow`,
        },
      },
    ],
  };
}

function tddCyclePrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const feature = args?.feature || "[FEATURE_TO_IMPLEMENT]";
  const testFramework = args?.test_framework || "auto-detect";

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Guide me through implementing the following feature using TDD:

## Feature: ${feature}
## Test Framework: ${testFramework}

---

## TDD Workflow:

### Step 1: RED - Write Failing Test
First, let's write a test that describes the expected behavior.
The test should:
- Be specific and focused
- Test one behavior
- Have a clear name describing the scenario

### Step 2: GREEN - Make It Pass
Write the minimum code needed to make the test pass.
- Don't over-engineer
- Don't add extra features
- Just make the test green

### Step 3: REFACTOR - Improve the Code
Now that tests are green, we can safely refactor:
- Remove duplication
- Improve naming
- Extract methods/functions
- Ensure tests still pass

### Step 4: REPEAT
Move to the next behavior and repeat the cycle.

---

Let's begin. First, search the codebase to understand:
1. Existing test patterns in this project
2. Where tests should be located
3. Any testing utilities already available

Then start with Step 1: Write a failing test for the most basic behavior of ${feature}.`,
        },
      },
    ],
  };
}

function createADRPrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const title = args?.title || "[DECISION_TITLE]";
  const context = args?.context || "[CONTEXT_AND_PROBLEM]";
  const options = args?.options || "";

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create an Architecture Decision Record (ADR) for:

## Title: ${title}

## Context:
${context}

## Options Considered:
${options || "(Please identify 2-3 viable options)"}

---

Please create an ADR with this structure:

# ADR-XXX: ${title}

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Date
${new Date().toISOString().split("T")[0]}

## Context
[Detailed explanation of the problem and constraints]

## Decision
[The chosen solution and why]

## Options Considered

### Option 1: [Name]
**Pros:**
- ...

**Cons:**
- ...

### Option 2: [Name]
**Pros:**
- ...

**Cons:**
- ...

## Consequences

### Positive
- ...

### Negative
- ...

### Risks
- ...

## Implementation Notes
[Any specific implementation guidance]

---

Search the codebase to understand existing patterns and constraints before finalizing the decision.`,
        },
      },
    ],
  };
}

function refactorSafelyPrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const target = args?.target || "[TARGET_CODE]";
  const goal = args?.goal || "[REFACTORING_GOAL]";

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Guide me through safely refactoring:

## Target: ${target}
## Goal: ${goal}

---

## Safe Refactoring Workflow:

### Phase 1: Understand
1. Read the target code thoroughly
2. Identify all callers/consumers
3. Understand the current behavior
4. Document any implicit behaviors

### Phase 2: Ensure Test Coverage
Before ANY changes:
1. Check existing test coverage
2. Add tests for any uncovered behavior
3. Create characterization tests if needed
4. All tests must pass

### Phase 3: Small Steps
Make changes incrementally:
1. Make one small change
2. Run tests
3. Commit if green
4. Repeat

### Phase 4: Refactor
Apply the refactoring pattern:
- Extract Method/Function
- Rename
- Move
- Inline
- Simplify Conditionals
- etc.

### Phase 5: Verify
1. All tests still pass
2. No behavior changes (unless intended)
3. Code is cleaner/simpler
4. Document any API changes

---

Let's start by reading the target code and understanding its current state.`,
        },
      },
    ],
  };
}

function debugIssuePrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const symptom = args?.symptom || "[WHAT_IS_HAPPENING]";
  const expected = args?.expected || "[WHAT_SHOULD_HAPPEN]";
  const context = args?.context || "";

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Help me debug this issue:

## Symptom (What's happening):
${symptom}

## Expected Behavior:
${expected}

## Additional Context:
${context || "(No additional context provided)"}

---

## Debugging Workflow:

### Step 1: Reproduce
- Establish exact steps to reproduce
- Document environment details
- Is it consistent or intermittent?

### Step 2: Isolate
- When did it start working/breaking?
- What changed recently?
- Can we narrow down the scope?

### Step 3: Hypothesize
- Form 2-3 theories about the cause
- Rank by likelihood

### Step 4: Test Hypotheses
- Start with most likely cause
- Add logging/debugging
- Verify or eliminate each theory

### Step 5: Fix & Verify
- Implement the fix
- Verify the symptom is gone
- Ensure no regressions
- Add a test to prevent recurrence

---

Let's start by searching the codebase for relevant code and recent changes.`,
        },
      },
    ],
  };
}

function implementFeaturePrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const prpName = args?.prp_name || "[PRP_NAME]";

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Implement feature from PRP: ${prpName}

---

## Implementation Workflow:

### Step 1: Load Context
- Read the PRP document
- Understand requirements
- Review acceptance criteria

### Step 2: Plan Implementation
- Break down into tasks
- Identify dependencies
- Estimate complexity

### Step 3: TDD Implementation
For each component:
1. Write failing test
2. Implement minimum code
3. Refactor
4. Commit

### Step 4: Integration
- Connect components
- Test integrations
- Handle edge cases

### Step 5: Quality Gates
- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Coverage threshold met
- [ ] Security review done

### Step 6: Documentation
- Update relevant docs
- Add code comments if needed
- Update CHANGELOG

---

${prpName === "new" ? "First, let's create a new PRP using the create-prp prompt." : `First, let's read the PRP at docs/planning/${prpName}.md`}`,
        },
      },
    ],
  };
}

function securityAuditPrompt(args?: Record<string, string>): {
  messages: PromptMessage[];
} {
  const scope = args?.scope || "full";
  const checklist = args?.checklist || "all";

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Perform a security audit:

## Scope: ${scope}
## Checklist: ${checklist}

---

## Security Audit Checklist:

### Authentication & Authorization
- [ ] Authentication mechanisms are secure
- [ ] Password policies enforced
- [ ] Session management is proper
- [ ] Authorization checks on all endpoints
- [ ] Principle of least privilege followed

### Input Validation
- [ ] All user input is validated
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] Command injection prevented
- [ ] Path traversal prevented

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Sensitive data encrypted in transit (TLS)
- [ ] PII handling compliant
- [ ] No sensitive data in logs
- [ ] Proper secret management

### API Security
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] API keys/tokens secured
- [ ] No sensitive data in URLs

### Dependencies
- [ ] No known vulnerabilities in deps
- [ ] Dependencies up to date
- [ ] Lock files present

### Error Handling
- [ ] No stack traces in production
- [ ] Error messages don't leak info
- [ ] Proper logging without sensitive data

---

For each finding, provide:
- **Severity**: Critical / High / Medium / Low
- **Location**: File and line number
- **Description**: What the issue is
- **Recommendation**: How to fix it
- **Example**: Code snippet showing the fix`,
        },
      },
    ],
  };
}
