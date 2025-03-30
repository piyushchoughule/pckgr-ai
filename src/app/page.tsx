'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { packageJsonSchema, PackageJsonSchema } from '@/lib/schemas/packageJsonSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

export default function PackageJsonForm() {
  const { register, control, formState: { errors } } = useForm<PackageJsonSchema>({
    resolver: zodResolver(packageJsonSchema),
    defaultValues: {
      private: true,
      sideEffects: false,
      type: 'module',
      dependencies: [],
      devDependencies: [],
    },
  });

  const dependenciesArray = useFieldArray({ control, name: 'dependencies' });
  const devDependenciesArray = useFieldArray({ control, name: 'devDependencies' });

  const watchedFields = useWatch({ control });

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full">
        {/* Metadata */}
        <AccordionItem value="metadata">
          <AccordionTrigger>Metadata</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <label>Name<Input placeholder="Name" {...register('name')} /></label>
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}

            <label>Version<Input placeholder="Version" {...register('version')} /></label>
            {errors.version && <span className="text-red-500">{errors.version.message}</span>}

            <label>Description<Input placeholder="Description" {...register('description')} /></label>
          </AccordionContent>
        </AccordionItem>

        {/* Scripts */}
        <AccordionItem value="scripts">
          <AccordionTrigger>Scripts</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <label>Build script<Input placeholder="Build script" {...register('scripts.build')} /></label>
            <label>Test script<Input placeholder="Test script" {...register('scripts.test')} /></label>
            <label>Start script<Input placeholder="Start script" {...register('scripts.start')} /></label>
          </AccordionContent>
        </AccordionItem>

        {/* Dependencies */}
        <AccordionItem value="dependencies">
          <AccordionTrigger>Dependencies</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {dependenciesArray.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <label>Dependency Name<Input placeholder="Dependency Name" {...register(`dependencies.${index}.name`)} /></label>
                <label>Version<Input placeholder="Version" {...register(`dependencies.${index}.version`)} /></label>
                <Button type="button" variant="destructive" onClick={() => dependenciesArray.remove(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => dependenciesArray.append({ name: '', version: '' })}>Add Dependency</Button>
          </AccordionContent>
        </AccordionItem>

        {/* Dev Dependencies */}
        <AccordionItem value="devDependencies">
          <AccordionTrigger>Dev Dependencies</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {devDependenciesArray.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <label>Dev Dependency Name<Input placeholder="Dev Dependency Name" {...register(`devDependencies.${index}.name`)} /></label>
                <label>Version<Input placeholder="Version" {...register(`devDependencies.${index}.version`)} /></label>
                <Button type="button" variant="destructive" onClick={() => devDependenciesArray.remove(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => devDependenciesArray.append({ name: '', version: '' })}>Add Dev Dependency</Button>
          </AccordionContent>
        </AccordionItem>

        {/* Configuration & Flags */}
        <AccordionItem value="config">
          <AccordionTrigger>Configuration & Flags</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <label>Private<Input placeholder="Private (true or false)" {...register('private')} /></label>
            <label>Side Effects<Input placeholder="Side Effects (true or false)" {...register('sideEffects')} /></label>
            <label>Type<Input placeholder="Type (module or commonjs)" {...register('type')} /></label>
            <label>Package Manager<Input placeholder="Package Manager" {...register('packageManager')} /></label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
        {JSON.stringify({
          ...watchedFields,
          dependencies: watchedFields.dependencies?.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.version }), {}),
          devDependencies: watchedFields.devDependencies?.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.version }), {}),
        }, null, 2)}
      </pre>
    </div>
  );
}
