@Entity
@Table(name = "glucose_ranges")
@Data
public class GlucoseRange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float min;
    private Float max;
    private String label;
}
