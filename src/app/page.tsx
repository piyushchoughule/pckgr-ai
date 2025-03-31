'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { packageJsonSchema, PackageJsonSchema } from '@/lib/schemas/packageJsonSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

export default function PackageJsonForm() {
  const { register, control, setValue, formState: { errors } } = useForm<PackageJsonSchema>({
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
    <Card className="shadow-xl min-h-screen rounded-none">
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-gray-50 min-h-screen">
        <div className="space-y-6">
          <Accordion type="multiple" defaultValue={["metadata"]} className="w-full">
            {/* Metadata */}
            <AccordionItem value="metadata">
              <AccordionTrigger>Metadata</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                <label className="font-semibold">Name<Input placeholder="Name" {...register('name')} /></label>
                {errors.name && <span className="text-red-500">{errors.name.message}</span>}

                <label className="font-semibold">Version<Input placeholder="Version" {...register('version')} /></label>
                {errors.version && <span className="text-red-500">{errors.version.message}</span>}

                <label className="font-semibold">Description<Input placeholder="Description" {...register('description')} /></label>
              </AccordionContent>
            </AccordionItem>

            {/* Scripts */}
            <AccordionItem value="scripts">
              <AccordionTrigger>Scripts</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                <label className="font-semibold">Build script<Input placeholder="Build script" {...register('scripts.build')} /></label>
                <label className="font-semibold">Test script<Input placeholder="Test script" {...register('scripts.test')} /></label>
                <label className="font-semibold">Start script<Input placeholder="Start script" {...register('scripts.start')} /></label>
              </AccordionContent>
            </AccordionItem>

            {/* Dependencies */}
            <AccordionItem value="dependencies">
              <AccordionTrigger>Dependencies</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                {dependenciesArray.fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <Input placeholder="Dependency Name" {...register(`dependencies.${index}.name`)} />
                    <Input placeholder="Version" {...register(`dependencies.${index}.version`)} />
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
                  <div key={field.id} className="flex items-end gap-2">
                    <Input placeholder="Dev Dependency Name" {...register(`devDependencies.${index}.name`)} />
                    <Input placeholder="Version" {...register(`devDependencies.${index}.version`)} />
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
                <label className="font-semibold flex items-center gap-2">Private<Switch defaultChecked={true} onCheckedChange={(value) => setValue('private', value)} /></label>
                <label className="font-semibold flex items-center gap-2">Side Effects<Switch defaultChecked={false} onCheckedChange={(value) => setValue('sideEffects', value)} /></label>
                <label className="font-semibold">Type
                  <Select defaultValue="module" onValueChange={(value) => setValue('type', value)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="module">module</SelectItem>
                      <SelectItem value="commonjs">commonjs</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="font-semibold">Package Manager<Input placeholder="Package Manager" {...register('packageManager')} /></label>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <pre className="bg-gray-800 text-white p-6 rounded-xl overflow-auto text-sm shadow-inner">
          {JSON.stringify({
            ...watchedFields,
            dependencies: watchedFields.dependencies?.reduce((acc, curr) => ({ ...acc, [curr.name as string]: curr.version }), {}),
            devDependencies: watchedFields.devDependencies?.reduce((acc, curr) => ({ ...acc, [curr.name as string]: curr.version }), {}),
          }, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
