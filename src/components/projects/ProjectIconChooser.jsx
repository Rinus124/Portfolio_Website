import { useMemo } from 'react';

const ProjectIconChooser = ({ tag }) => {
    const iconMap = {
        'C++': 'cplusplus',
        'JavaScript': 'javascript',
        'Python': 'python',
        'React': 'react',
        'Vue': 'vue',
        'TypeScript': 'typescript',
        // Voeg meer tags toe naar behoefte
    };

    const iconName = useMemo(() => {
        return iconMap[tag] || 'default';
    }, [tag]);

    const iconPath = `.../public/${iconName}.svg`;

    return (
        <img 
            src={iconPath}
            alt={`${tag} icon`}
            className="inline-block w-4 h-4 mr-1 align-text-bottom"
        />
    );
};

export default ProjectIconChooser;