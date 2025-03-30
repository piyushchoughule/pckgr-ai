import { z } from 'zod';

export const dependencySchema = z.object({
  name: z.string().min(1, "Dependency name required"),
  version: z.string().min(1, "Version required"),
});

export const packageJsonSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  version: z.string().regex(/^(\d+\.)?(\d+\.)?(\*|\d+)$/, "Invalid version format"),
  description: z.string().optional(),

  scripts: z.object({
    build: z.string().optional(),
    test: z.string().optional(),
    start: z.string().optional(),
  }),

  dependencies: z.array(dependencySchema).optional(),
  devDependencies: z.array(dependencySchema).optional(),

  repository: z.string().url().optional(),
  publishConfig: z.string().url().optional(),

  private: z.boolean().default(true),
  sideEffects: z.boolean().default(false),
  type: z.enum(["module", "commonjs"]).default("module"),
  packageManager: z.string().optional(),
});

export type PackageJsonSchema = z.infer<typeof packageJsonSchema>;
