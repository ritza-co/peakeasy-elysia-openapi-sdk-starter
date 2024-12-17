import * as yaml from 'js-yaml';

async function generateOpenAPIYaml() {
  try {
    const response = await fetch('http://localhost:3000/swagger/json');
    const openAPIObject = await response.json();

    // Convert to YAML
    const yamlString = yaml.dump(openAPIObject);

    // Save the YAML string to a file
    await Bun.write('openapi.yaml', yamlString);
    
    console.log('OpenAPI spec saved to openapi.yaml');
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
  }
}

generateOpenAPIYaml();